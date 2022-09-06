import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Header } from '@polkadot/types/interfaces'
import { Repository } from 'typeorm'
import { FetchBlocksInput } from './dtos/fetch-blocks.input'
import { Block } from './entity/block.entity'

@Injectable()
export class BlocksService {
  constructor(
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

  async createFromHeader(header: Header): Promise<Block> {
    const { hash, parentHash, number } = header
    const block = this.blockRepository.create({
      hash: hash.toString(),
      parentHash: parentHash.toString(),
      number: parseInt(number.toHex()),
    })
    return this.blockRepository.save(block)
  }

  async getMissingBlocks(): Promise<{ number: number }[]> {
    const blocks = await this.blockRepository.query(`
      SELECT generate_series(
        (SELECT MIN(number) FROM blocks),
        (SELECT MAX(number) FROM blocks)
      ) AS number
      EXCEPT SELECT number FROM blocks
      ORDER BY number ASC;
    `)
    return blocks
  }

  async getLastBlock(): Promise<Block> {
    const block = await this.blockRepository.find({
      take: 1,
      order: { number: 'DESC' },
    })
    return block[0]
  }
}
