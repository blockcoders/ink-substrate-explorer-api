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

    const lastDBBlockNumber = await (await this.blocksService.getLastBlock()).number
    const lastBlockNumber = await (await api.rpc.chain.getHeader()).number.toNumber()
    let loadFromBlockNumber: number
    if (process.env.LOAD_ALL_BLOCKS === 'true') {
      loadFromBlockNumber = Number(process.env.FIRST_BLOCK_TO_LOAD)
    } else {
      loadFromBlockNumber = lastDBBlockNumber + 1
    }
    // Starts syncing blocks
    await api.rpc.chain.subscribeAllHeads(async (lastHeader: Header) => {
      const [
        {
          block: { header, extrinsics },
        },
        records,
      ] = await Promise.all([api.rpc.chain.getBlock(lastHeader.hash), api.query.system.events.at(lastHeader.hash)])
      await this.registerBlockData(header, extrinsics, records)
    })

    // Starts loading historic blocks
    if (loadFromBlockNumber >= lastBlockNumber) {
      console.log(`\n\nAlready synced.`)
    }
    const blocksToLoad = Array.from(
      Array(lastBlockNumber - loadFromBlockNumber).keys(),
      (i) => i + 1 + loadFromBlockNumber,
    )
    console.log('Blocks to load: %j', blocksToLoad.length)
    console.log('From: ', blocksToLoad[0])
    console.log('To: ', blocksToLoad[blocksToLoad.length - 1])

    // TODO: Improve this. If high amount of queries, it will fail.
    const hashes = await Promise.all(blocksToLoad.map((i) => api.rpc.chain.getBlockHash(i)))
    const blockAndRecords: any[] = await Promise.all(
      hashes.map(async (h) => Promise.all([api.rpc.chain.getBlock(h), api.query.system.events.at(h)])),
    )

    for (const register of blockAndRecords) {
      const [
        {
          block: { header, extrinsics },
        },
        records,
      ] = register
      const { block, transactions } = await this.registerBlockData(header, extrinsics, records)
      console.log('\n-----------------New block-----------------\n')
      console.log('\nBlock Hash: %j', block.hash, block.number)
      console.log('\nTransactions count: %j', transactions.length)
      console.log('\n-------------------------------------------\n')
    }
    console.log('\n\nAll blocks loaded!')
  }

  async registerBlockData(header: any, extrinsics: any, records: any) {
    const block = await this.blocksService.createFromHeader(header)
    const transactions = await this.transactionsService.createTransactionsFromExtrinsics(extrinsics, block.hash)
    transactions.forEach(async (transaction, index) => {
      await this.eventsService.createEventsFromRecords(records, index, transaction.hash)
    })
    return { block, transactions }
  }
}
