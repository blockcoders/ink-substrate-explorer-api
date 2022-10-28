/* eslint-disable @typescript-eslint/no-var-requires */

import { Injectable, OnModuleInit } from '@nestjs/common'
import '@polkadot/api-augment'
import { ApiPromise } from '@polkadot/api'
import { BlockHash, Header } from '@polkadot/types/interfaces'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import PQueue from 'p-queue'
import { BlocksService } from '../blocks/blocks.service'
import { EventsService } from '../events/events.service'
import { TransactionsService } from '../transactions/transactions.service'
import { connect } from '../utils'
const retry = require('async-await-retry')

const FIRST_BLOCK_TO_LOAD = Number(process.env.FIRST_BLOCK_TO_LOAD) || 0
const BLOCKS_CONCURRENCY = Number(process.env.BLOCKS_CONCURRENCY) || 1000
const LOAD_ALL_BLOCKS = process.env.LOAD_ALL_BLOCKS === 'true'
const WS_PROVIDER = process.env.WS_PROVIDER || 'ws://127.0.0.1:9944'

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  constructor(
    @InjectPinoLogger(SubscriptionsService.name)
    private readonly logger: PinoLogger,
    private readonly blocksService: BlocksService,
    private transactionsService: TransactionsService,
    private readonly eventsService: EventsService,
  ) {}

  onModuleInit(): void {
    try {
      this.logger.info('Subscribing to new heads...')
      this.syncBlocks()
    } catch (error) {
      this.logger.error({ error }, 'Error while processing blocks.')
      throw error
    }
  }

  async syncBlocks() {
    const api = await connect(WS_PROVIDER)
    const lastDBBlockNumber = (await this.blocksService.getLastBlock())?.number || 0
    const lastBlockNumber = (await api.rpc.chain.getHeader()).number.toNumber()
    const loadFromBlockNumber = LOAD_ALL_BLOCKS ? FIRST_BLOCK_TO_LOAD : lastDBBlockNumber

    await this.subscribeNewHeads(api)

    // Starts loading historic blocks
    if (loadFromBlockNumber >= lastBlockNumber) {
      this.logger.info('Already synced!')
      this.logger.debug(`loadFromBlockNumber: ${loadFromBlockNumber}, lastBlockNumber: ${lastBlockNumber}`)
      return
    }

    const blocksToLoad = this.getBlocksToLoad(loadFromBlockNumber, lastBlockNumber)
    this.logger.info(`Loading ${blocksToLoad.length} blocks. This may take a while...`)
    this.logger.debug(`From: ${blocksToLoad[0]}. To: ${blocksToLoad[blocksToLoad.length - 1]}`)
    const queue = new PQueue({ concurrency: BLOCKS_CONCURRENCY })
    const q = blocksToLoad.map(
      (blockNumber) => () =>
        new Promise(async (res, rej) => {
          try {
            res(this.processBlock(api, blockNumber))
          } catch (error) {
            rej(error)
          }
        }),
    )
    return queue.addAll(q as any)
  }

  async subscribeNewHeads(api: ApiPromise) {
    await api.rpc.chain.subscribeAllHeads(async (lastHeader: Header) => {
      const blockData = await this.getBlockData(api, lastHeader.hash)
      await this.registerBlockData(blockData)
    })
  }

  async getBlockData(api: ApiPromise, hash: BlockHash) {
    const [block, records] = await Promise.all([api.rpc.chain.getBlock(hash), api.query.system.events.at(hash)])
    const encodedLength = block.encodedLength
    const { header, extrinsics } = block.block || {}
    const timestampArgs = extrinsics.map((e) => e.method).find((m) => m.section === 'timestamp' && m.method === 'set')
    const timestamp = Number(timestampArgs?.args[0].toString()) || Date.now()
    return { header, extrinsics, records, timestamp, encodedLength }
  }

  getBlocksToLoad(from: number, to: number): number[] {
    return Array.from(Array(Math.max(to - from, 0)).keys(), (i) => i + 1 + from)
  }

  async processBlock(api: ApiPromise, blockNumber: number) {
    try {
      return await retry(
        async () => {
          const hash = await api.rpc.chain.getBlockHash(blockNumber)
          const blockData = await this.getBlockData(api, hash)
          const block = await this.registerBlockData(blockData)
          this.logger.info(`Block ${block.number} loaded.`)
          this.logger.debug(`Block hash: ${block.hash}`)
          return hash
        },
        undefined,
        {
          retriesMax: 3,
          interval: 100,
          exponential: true,
        },
      )
    } catch (error) {
      this.logger.error({ error }, 'Error loading block: %d', blockNumber)
      throw error
    }
  }

  async registerBlockData(blockData: any) {
    const { header, extrinsics, records, timestamp, encodedLength } = blockData
    const block = await this.blocksService.createFromHeader(header, timestamp, encodedLength)
    const transactions = await this.transactionsService.createTransactionsFromExtrinsics(
      extrinsics,
      block.hash,
      timestamp,
    )
    for (const [index, tx] of transactions.entries()) {
      await this.eventsService.createEventsFromRecords(records, index, tx.hash, timestamp)
    }
    return block
  }
}
