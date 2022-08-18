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
    const { hash, parentHash, number } = header || {}
    const block = this.blockRepository.create({
      hash: hash.toString(),
      parentHash: parentHash.toString(),
      number: parseInt(number.toHex()),
    })
    return this.blockRepository.save(block)
  }
}
