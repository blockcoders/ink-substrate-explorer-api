/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Header } from '@polkadot/types/interfaces'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Repository } from 'typeorm'
import { FetchBlocksInput } from './dtos/fetch-blocks.input'
import { Block } from './entity/block.entity'
const retry = require('async-await-retry')

@Injectable()
export class BlocksService {
  constructor(
    @InjectPinoLogger(BlocksService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
  ) {}

  async findOne(hash: string): Promise<Block> {
    const block = await this.blockRepository.findOneBy({ hash })
    if (!block) {
      throw new NotFoundException(`Block with hash: ${hash} not found`)
    }
    return block
  }

  async fetchBlocks(args: FetchBlocksInput): Promise<Block[]> {
    return this.blockRepository.find(args)
  }

  async createFromHeader(header: Header, timestamp: number): Promise<Block> {
    try {
      const { hash, parentHash, number } = header
      const block = this.blockRepository.create({
        hash: hash.toString().toLowerCase(),
        parentHash: parentHash.toString().toLowerCase(),
        number: parseInt(number.toHex()),
        timestamp,
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
