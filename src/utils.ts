import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'
import erc20 from './metadata/erc20'
import Block from './models/block.entity'
import Event from './models/event.entity'

export const substrateSubscriptions = async () => {
  const providerUrl = process.env.WS_PROVIDER || ''
  console.log(`\n\nConnecting to ${providerUrl}`)
  const provider = new WsProvider(providerUrl)
  const polkadotApi = await ApiPromise.create({ provider })
  console.log(`\n\nSubscribing to new heads...`)
  await subscribeAllHeads(polkadotApi)
  console.log(`\n\nSubscribing to new events...`)
  await subscribeToNewEvents(polkadotApi)
}

export const subscribeAllHeads = async (provider: ApiPromise, cb?: (b: Block) => Promise<void> | void) => {
  await provider.rpc.chain.subscribeAllHeads(async (h: any) => {
    const { block } = await provider.rpc.chain.getBlock(h.hash)
    const { hash, header, extrinsics } = block
    const b = new Block(hash, header, extrinsics)
    if (!cb) {
      console.log('\n-----------------New block-----------------\n')
      console.log('BLOCK HASH: %j', b.hash)
      console.log('TX COUNT: %j', b.transactions.length)
      b.transactions.forEach((tx) => console.log('\n\t TX: %j', tx))
      console.log('\n-------------------------------------------\n')
    } else {
      await cb(b)
    }
  })
}

export const subscribeToNewEvents = async (provider: ApiPromise, cb?: (e: Event) => Promise<void> | void) => {
  await provider.query.system.events((events) => {
    events.forEach(async (record) => {
      const { event, phase, topics } = record
      if (provider.events.contracts.ContractEmitted.is(event)) {
        const e = new Event(event, phase, topics)
        const decoded = e.decode(erc20)
        const summary: any = {}
        for (let i = 0; i < decoded?.event?.args.length; i++) {
          const arg = decoded.event.args[i].name
          const { type } = decoded.event.args[i].type
          summary[arg] = type === 'Balance' ? parseInt(decoded.args[i].toString()) / 1000000000000 : decoded.args[i]
        }
        if (!cb) {
          console.log('\n-----------------New Event-----------------\n')
          console.log('\nEvent: %j', decoded.event.identifier)
          console.log('\nSummary: %j', summary)
          console.log('\nContract: %j', e.contract)
          console.log('\nIndex: %j', e.index)
          console.log('\nSection: %j', e.section)
          console.log('\nMethod: %j', e.method)
          console.log('\nPhase: %j', phase)
          console.log('\nTopics: %j', topics)
          console.log('\nMeta: %j', e.meta)
          console.log('\nTypeDef: %j', e.typeDef)
          console.log('\nData: %j', e.data)
          console.log('\nDecoded: %j', decoded)
          console.log('\n-------------------------------------------\n')
        } else {
          await cb(e)
        }
      }
    })
  })
}
