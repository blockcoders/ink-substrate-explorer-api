import { Injectable, OnModuleInit } from '@nestjs/common'
import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Header } from '@polkadot/types/interfaces'
import PQueue from 'p-queue'
import { BlocksService } from '../blocks/blocks.service'
import { EventsService } from '../events/events.service'
import { TransactionsService } from '../transactions/transactions.service'

const FIRST_BLOCK_TO_LOAD = Number(process.env.FIRST_BLOCK_TO_LOAD) || 0
const BLOCKS_CONCURRENCY = Number(process.env.BLOCKS_CONCURRENCY) || 1000

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

    const lastDBBlockNumber = (await this.blocksService.getLastBlock())?.number || 0
    const lastBlockNumber = (await api.rpc.chain.getHeader()).number.toNumber()
    const loadFromBlockNumber = process.env.LOAD_ALL_BLOCKS === 'true' ? FIRST_BLOCK_TO_LOAD : lastDBBlockNumber + 1
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
      console.log(`\n\nAlready synced. loadFromBlockNumber: ${loadFromBlockNumber}, lastBlockNumber: ${lastBlockNumber}`)
      return
    }

    const arrayLength = Math.max(lastBlockNumber - loadFromBlockNumber, 0)
    const blocksToLoad = Array.from(Array(arrayLength).keys(), (i) => i + 1 + loadFromBlockNumber)
    console.log('Blocks to load: %j', blocksToLoad.length)
    console.log('From: ', blocksToLoad[0])
    console.log('To: ', blocksToLoad[blocksToLoad.length - 1])

    const queue = new PQueue({ concurrency: BLOCKS_CONCURRENCY })

    console.time('All blocks loaded!')

    const q = blocksToLoad.map((i) => {
      return () =>
        new Promise(async (res, rej) => {
          try {
            const hash = await api.rpc.chain.getBlockHash(i)

            const blockAndRecords: any[] = await Promise.all(
              [hash].map(async (h) => Promise.all([api.rpc.chain.getBlock(h), api.query.system.events.at(h)])),
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
              console.log(`\nBlock Hash: ${block.hash}\nBlock number: ${block.number}\nTransactions: ${transactions.length}\n`)
            }
            res(hash)
          } catch (error) {
            console.log("Error loading block: ", i)
            //rej(error)
          }
        })
    })

    await queue.addAll(q as any)

    console.timeEnd('All blocks loaded!')
    return
  }

  async registerBlockData(header: any, extrinsics: any, records: any) {
      const block = await this.blocksService.createFromHeader(header)
      const transactions = await this.transactionsService.createTransactionsFromExtrinsics(extrinsics, block.hash)
      for (const [index, tx] of transactions.entries()) {
        await this.eventsService.createEventsFromRecords(records, index, tx.hash)
      }
      return { block, transactions }
  }
}
