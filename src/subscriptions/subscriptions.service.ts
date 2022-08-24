import { Injectable, OnModuleInit } from '@nestjs/common'
import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Abi } from '@polkadot/api-contract'
import { Header } from '@polkadot/types/interfaces'
import { numberToU8a } from '@polkadot/util'
import erc20 from 'src/metadata/erc20'
import { BlocksService } from '../blocks/blocks.service'
import { EventsService } from '../events/events.service'
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
  }

  static async connect() {
    const provider = new WsProvider(process.env.WS_PROVIDER)
    return ApiPromise.create({ provider })
  }

  async subscribeAllHeads() {
    const api = await SubscriptionsService.connect()
    await api.rpc.chain.subscribeAllHeads(async (lastHeader: Header) => {
      const [
        {
          block: { header, extrinsics },
        },
        records,
      ] = await Promise.all([api.rpc.chain.getBlock(lastHeader.hash), api.query.system.events.at(lastHeader.hash)])
      const block = await this.blocksService.createFromHeader(header)
      const transactions = await this.transactionsService.createTransactionsFromExtrinsics(extrinsics, block.hash)
      transactions.forEach(async (transaction, index) => {
        const events = await this.eventsService.createEventsFromRecords(records, index, transaction.hash)

        events.forEach(async (e) => {
          const event = await this.eventsService.findById(e.id)
          if (!event) throw new Error(`NOT FOUND WITH ID: ${e.id}`)
          const [, ev] = event.jsonData as any
          if (e.method === 'ContractEmitted') {
            try {
              const a = new Abi(erc20).decodeEvent(numberToU8a(ev))
              console.log(a.event)
            } catch (error) {
              console.warn(error)
            }
          }
        })
      })

      console.log('\n-----------------New block-----------------\n')
      console.log('\nBlock Hash: %j', block.hash)
      console.log('\nTransactions count: %j', transactions.length)
      console.log('\n-------------------------------------------\n')
    })
  }
}
