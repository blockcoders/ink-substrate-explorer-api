import { Injectable } from '@nestjs/common'
import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Block } from '../../blocks/entity/block.entity'
import { Event } from '../../events/entity/event.entity'
//import erc20 from '../metadata/erc20'

@Injectable()
export class SubscriptionsService {
  provider: WsProvider
  constructor(providerUrl: string) {
    console.log(`\n\nConnecting to ${providerUrl}`)
    this.provider = new WsProvider(providerUrl)
  }

  async substrateSubscriptions() {
    console.log(`\n\nSubscribing to new heads...`)
    await this.subscribeAllHeads()
    console.log(`\n\nSubscribing to new events...`)
    await this.subscribeToNewEvents()
  }

  async subscribeAllHeads(cb?: (b: Block) => Promise<void> | void) {
    const api: ApiPromise = await ApiPromise.create({ provider: this.provider })
    await api.rpc.chain.subscribeAllHeads(async (h: any) => {
      const { block } = await api.rpc.chain.getBlock(h.hash)
      //const { hash, header, extrinsics } = block
      //const b = new Block(hash, header, extrinsics)
      if (!cb) {
        console.log('\n-----------------New block-----------------\n')
        console.log('BLOCK HASH: %j', block) // b.hash
        // console.log('TX COUNT: %j', b.transactions.length)
        // b.transactions.forEach((tx) => console.log('\n\t TX: %j', tx))
        console.log('\n-------------------------------------------\n')
      } else {
        //await cb(b)
      }
    })
  }

  async subscribeToNewEvents(cb?: (e: Event) => Promise<void> | void) {
    const api: ApiPromise = await ApiPromise.create({ provider: this.provider })
    await api.query.system.events((events) => {
      events.forEach(async (record) => {
        const { event /*phase, topics*/ } = record
        if (api.events.contracts.ContractEmitted.is(event)) {
          // const e = new Event(event, phase, topics)
          //const decoded = e.decode(erc20)
          //const summary: any = {}
          // for (let i = 0; i < decoded?.event?.args.length; i++) {
          //   const arg = decoded.event.args[i].name
          //   const { type } = decoded.event.args[i].type
          //   summary[arg] = type === 'Balance' ? parseInt(decoded.args[i].toString()) / 1000000000000 : decoded.args[i]
          // }
          if (!cb) {
            console.log('\n-----------------New Event-----------------\n')
            /* console.log('\nEvent: %j', decoded.event.identifier)
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
                  console.log('\nDecoded: %j', decoded)*/
            console.log('\n-------------------------------------------\n')
          } else {
            //await cb(e)
          }
        }
      })
    })
  }
}
