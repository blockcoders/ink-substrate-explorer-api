import { Injectable, OnModuleInit } from '@nestjs/common'
import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Header } from '@polkadot/types/interfaces'
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
      await this.registerAllBlockData(header, extrinsics, records)
    })

    if (process.env.LOAD_ALL_BLOCKS === 'true') await this.loadAllBlocks(api)
  }

  async loadAllBlocks(api: ApiPromise) {
    console.log('loading all blocks.....')
    const lastBlock = await api.rpc.chain.getBlock()
    const lastBlockNumber = lastBlock.block.header.number.toNumber()

    const arrayWithBlockNumbers = Array.from(Array(lastBlockNumber + 1).keys())

    const hashes = await Promise.all(arrayWithBlockNumbers.map((i) => api.rpc.chain.getBlockHash(i)))

    // load historic data
    const blockAndRecords: any[] = await Promise.all(
      hashes.map(async (h) => {
        const resp = await Promise.all([api.rpc.chain.getBlock(h), api.query.system.events.at(h)])
        return resp
      }),
    )

    for (const register of blockAndRecords) {
      const [
        {
          block: { header, extrinsics },
        },
        records,
      ] = register
      const { block, transactions } = await this.registerAllBlockData(header, extrinsics, records)
      console.log('\n-----------------New block-----------------\n')
      console.log('\nBlock Hash: %j', block.hash, block.number)
      console.log('\nTransactions count: %j', transactions.length)
      console.log('\n-------------------------------------------\n')
    }
    console.log('all block loaded!')
  }

  async registerAllBlockData(header: any, extrinsics: any, records: any) {
    const block = await this.blocksService.createFromHeader(header)
    const transactions = await this.transactionsService.createTransactionsFromExtrinsics(extrinsics, block.hash)
    transactions.forEach(async (transaction, index) => {
      await this.eventsService.createEventsFromRecords(records, index, transaction.hash)
    })
    return { block, transactions }
  }
}
