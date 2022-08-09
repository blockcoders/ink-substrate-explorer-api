import { Injectable, OnModuleInit } from '@nestjs/common'
import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Header } from '@polkadot/types/interfaces'
import { BlocksService } from '../blocks/blocks.service'
import { Block } from '../blocks/entity/block.entity'
import { Event } from '../events/entity/event.entity'
//import { TransactionsService } from '../transactions/transactions.service'
import { EventsService } from '../events/events.service'
//import { CreateTransactionInput } from '../transactions/dtos/create-transaction.input'
//import erc20 from '../metadata/erc20'

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  constructor(
    private readonly blocksService: BlocksService,
    //private transactionsService: TransactionsService,
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

  async subscribeAllHeads(cb?: (b: Block) => Promise<void> | void) {
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
      if (!cb) {
        console.log('\n-----------------New block-----------------\n')
        console.log('BLOCK HASH: %j', hash)
        console.log('TX COUNT: %j', extrinsics.length)
        /*extrinsics.forEach((ex) => {
          console.log('\n\t TX: %j', ex)
          const tx = new CreateTransactionInput(ex, hash)
          this.transactionsService.create(tx)
        })*/
        console.log('\n-------------------------------------------\n')
      } else {
        await cb(b)
      }
    })
  }

  async subscribeToNewEvents(cb?: (e: Event) => Promise<void> | void) {
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
          }
          const e = await this.eventsService.create(createEventInput)
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
            await cb(e)
          }
        }
      })
    })
  }
}
