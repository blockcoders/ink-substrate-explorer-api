import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateBlockInput } from './dtos/create-block.input'
import Block from './block.entity'

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
  ) {}

  async create(createBlockInput: CreateBlockInput): Promise<Block> {
    const block = this.blockRepository.create(createBlockInput)
    return await this.blockRepository.save(block)
  }

  async findOne(hash: string): Promise<Block> {
    const block = await this.blockRepository.findOneBy({ hash })
    if (!block) {
      throw new NotFoundException(`Block with hash: ${hash} not found`)
    }
    return block
  }
}
