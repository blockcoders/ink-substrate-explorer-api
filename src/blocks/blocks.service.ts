import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Block } from './entity/block.entity'
import { Repository } from 'typeorm'
import { CreateBlockInput } from './dtos/create-block.input'

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
  ) {}

  async create(createBlockInput: CreateBlockInput): Promise<Block> {
    return this.blockRepository.save(createBlockInput)
  }

  async findOne(hash: string): Promise<Block> {
    const block = await this.blockRepository.findOneBy({ hash })
    if (!block) {
      throw new NotFoundException(`Block with hash: ${hash} not found`)
    }
    return block
  }
}
