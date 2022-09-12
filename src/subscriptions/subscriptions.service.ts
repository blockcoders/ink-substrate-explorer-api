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
const LOAD_ALL_BLOCKS = process.env.LOAD_ALL_BLOCKS === 'true'

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  constructor(
    private readonly blocksService: BlocksService,
    private transactionsService: TransactionsService,
    private readonly eventsService: EventsService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      console.log(`\n\nSubscribing to new heads...`)
      await this.syncBlocks()
    } catch (error) {
      console.error("Error while processing blocks: ", error)
      throw error
    }
  }

  static async connect() {
    const provider = new WsProvider(process.env.WS_PROVIDER)
    return ApiPromise.create({ provider })
  }

  async subscribeNewHeads(api: ApiPromise) {
    await api.rpc.chain.subscribeAllHeads(async (lastHeader: Header) => {
      const [
        {
          block: { header, extrinsics },
        },
        records,
      ] = await Promise.all([api.rpc.chain.getBlock(lastHeader.hash), api.query.system.events.at(lastHeader.hash)])
      await this.registerBlockData(header, extrinsics, records)
    })
  }

  async syncBlocks() {
    const api = await SubscriptionsService.connect()

    const lastDBBlockNumber = (await this.blocksService.getLastBlock())?.number || 0
    const lastBlockNumber = (await api.rpc.chain.getHeader()).number.toNumber()
    const loadFromBlockNumber = LOAD_ALL_BLOCKS ? FIRST_BLOCK_TO_LOAD : lastDBBlockNumber

    await this.subscribeNewHeads(api)

    // Starts loading historic blocks
    if (loadFromBlockNumber >= lastBlockNumber) {
      console.log(`\n\nAlready synced.`)
      console.debug(`loadFromBlockNumber: ${loadFromBlockNumber}, lastBlockNumber: ${lastBlockNumber}`)
      return
    }

    const arrayLength = Math.max(lastBlockNumber - loadFromBlockNumber, 0)
    const blocksToLoad = Array.from(Array(arrayLength).keys(), (i) => i + 1 + loadFromBlockNumber)
    console.log('Blocks to load: %j', blocksToLoad.length)
    console.log('From: ', blocksToLoad[0])
    console.log('To: ', blocksToLoad[blocksToLoad.length - 1])

    const queue = new PQueue({ concurrency: BLOCKS_CONCURRENCY })
    const q = blocksToLoad.map(
      (i) => () =>
        new Promise(async (res, rej) => {
          try {
            res(this.processBlock(api, i))
          } catch (error) {
            console.error('Error loading block: ', i)
            //rej(error)
          }
        }),
    )
    return queue.addAll(q as any)
  }

  async processBlock(api: ApiPromise, blockNumber: number) {
    try {
      const hash = await api.rpc.chain.getBlockHash(blockNumber)

      const register = await Promise.all([api.rpc.chain.getBlock(hash), api.query.system.events.at(hash)])
      const [
        {
          block: { header, extrinsics },
        },
        records,
      ] = register
      const block = await this.registerBlockData(header, extrinsics, records)
      console.log('\n-----------------New block-----------------\n')
      console.log(`\nBlock Hash: ${block.hash}\nBlock number: ${block.number}\n`)
      return hash
    } catch (error) {
      console.error('Error loading block: ', blockNumber)
      throw error
    }
  }

  async registerBlockData(header: any, extrinsics: any, records: any) {
    const block = await this.blocksService.createFromHeader(header)
    const transactions = await this.transactionsService.createTransactionsFromExtrinsics(extrinsics, block.hash)
    for (const [index, tx] of transactions.entries()) {
      await this.eventsService.createEventsFromRecords(records, index, tx.hash)
    }
    return block
  }
}
