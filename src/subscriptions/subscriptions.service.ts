import { Injectable, OnModuleInit } from '@nestjs/common'
import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Abi } from '@polkadot/api-contract'
import { Header } from '@polkadot/types/interfaces'
import { BlocksService } from '../blocks/blocks.service'
import { EventsService } from '../events/events.service'
import erc20 from '../metadata/erc20'
import { TransactionsService } from '../transactions/transactions.service'

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  constructor(
    private readonly blocksService: BlocksService,
    private transactionsService: TransactionsService,
    private readonly eventsService: EventsService,
  ) {}

  async onModuleInit(): Promise<void> {
    console.log(`\n\nSubscribing to new heads...`)
    await this.subscribeAllHeads()
    console.log(`\n\nSubscribing to new events...`)
    await this.subscribeToNewEvents()
  }

  static async connect() {
    const provider = new WsProvider(process.env.WS_PROVIDER)
    return ApiPromise.create({ provider })
  }

  async subscribeAllHeads() {
    const api = await SubscriptionsService.connect()
    await api.rpc.chain.subscribeAllHeads(async (h: Header) => {
      const { block } = await api.rpc.chain.getBlock(h.hash)
      const {
        hash,
        header: { parentHash, number },
        extrinsics,
      } = block
      const createBlockInput = {
        hash: hash.toString(),
        parentHash: parentHash.toString(),
        number: parseInt(number.toHex()),
      }
      const b = await this.blocksService.create(createBlockInput)
      console.log('\n-----------------New block-----------------\n')
      console.log('BLOCK HASH: %j', b.hash)
      console.log('TX COUNT: %j', extrinsics.length)
      extrinsics.forEach(async (ex) => {
        const { hash, nonce, signature, signer, tip } = ex
        const { method, section } = ex.method
        const createTransactionInput = {
          hash: hash.toString(),
          blockHash: b.hash,
          method,
          section,
          nonce: nonce.toNumber(),
          signature: signature.toString(),
          signer: signer.toString(),
          tip: tip.toNumber(),
        }
        const tx = await this.transactionsService.create(createTransactionInput)
        console.log('\n\t TX: %j', tx)
      })
      console.log('\n-------------------------------------------\n')
    })
  }

  async subscribeToNewEvents() {
    const api = await SubscriptionsService.connect()
    await api.query.system.events((events) => {
      events.forEach(async (record) => {
        const { event, topics } = record
        if (api.events.contracts.ContractEmitted.is(event)) {
          const { section, method, data, index } = event
          const [account_id] = data
          const createEventInput = {
            contract: account_id.toString(),
            index: index.toHex(),
            section,
            method,
            topics: topics.toString(),
            data: data.toString(),
          }
          const e = await this.eventsService.create(createEventInput)
          const decoded = SubscriptionsService.decode(erc20, data)
          const summary: any = {}
          for (let i = 0; i < decoded?.event?.args.length; i++) {
            const arg = decoded.event.args[i].name
            const { type } = decoded.event.args[i].type
            summary[arg] = type === 'Balance' ? parseInt(decoded.args[i].toString()) / 1000000000000 : decoded.args[i]
          }

          console.log('\n-----------------New Event-----------------\n')
          console.log('\nEvent: %j', decoded.event.identifier)
          console.log('\nSummary: %j', summary)
          console.log('\nContract: %j', e.contract)
          console.log('\nIndex: %j', e.index)
          console.log('\nSection: %j', e.section)
          console.log('\nMethod: %j', e.method)
          //console.log('\nPhase: %j', phase)
          console.log('\nTopics: %j', topics)
          //console.log('\nMeta: %j', e.meta)
          //console.log('\nTypeDef: %j', e.typeDef)
          //console.log('\nData: %j', e.data)
          console.log('\nDecoded: %j', decoded)
          console.log('\n-------------------------------------------\n')
        }
      })
    })
  }

  static decode(abi: string | Record<string, unknown>, data: any) {
    const [, contract_evt] = data
    return new Abi(abi).decodeEvent(contract_evt)
  }
}
