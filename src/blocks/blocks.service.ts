/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Header } from '@polkadot/types/interfaces'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { MongoRepository } from 'typeorm'
import { FetchBlocksInput } from './dtos/fetch-blocks.input'
import { Block } from './entity/block.entity'
const retry = require('async-await-retry')

@Injectable()
export class BlocksService {
  constructor(
    @InjectPinoLogger(BlocksService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(Block)
    private readonly blockRepository: MongoRepository<Block>,
  ) {}

  async findOne(hash: string): Promise<Block> {
    const block = await this.blockRepository.findOneBy({ hash })
    if (!block) {
      throw new NotFoundException(`Block with hash: ${hash} not found`)
    }
    return block
  }

  async fetchBlocks(args: FetchBlocksInput): Promise<Block[]> {
    const { skip, take, orderByNumber, orderAsc } = args
    const order: any = {}
    const by = orderByNumber ? 'number' : 'timestamp'
    order[by] = orderAsc ? 'ASC' : 'DESC'
    return this.blockRepository.find({ skip, take, order })
  }

  async createFromHeader(header: Header, timestamp: number, encodedLength: number): Promise<Block> {
    try {
      const { hash, parentHash, number } = header
      const block = this.blockRepository.create({
        hash: hash.toString().toLowerCase(),
        parentHash: parentHash.toString().toLowerCase(),
        number: parseInt(number.toHex()),
        timestamp,
        encodedLength,
      })
      const persistedBlock = await retry(
        async () => {
          const existing = await this.blockRepository.findOneBy({ hash: block.hash })
          return existing || (await this.blockRepository.save(block))
        },
        undefined,
        {
          retriesMax: 3,
          interval: 100,
          exponential: true,
        },
      )
      return persistedBlock
    } catch (error) {
      this.logger.error({ error }, 'Error creating block.')
      throw error
    }
  }

  async getLastBlock(): Promise<Block> {
    const block = await this.blockRepository.find({
      take: 1,
      order: { number: 'DESC' },
    })
    return block[0]
  }
}
