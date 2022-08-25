import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contract } from './entity/contract.entity'

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  async findOne(hash: string): Promise<Contract> {
    const contract = await this.contractRepository.findOneBy({ hash })
    if (!contract) {
      throw new NotFoundException(`Contract with hash: ${hash} not found`)
    }
    return contract
  }

  async uploadMetadata(contract: Contract, metadata: string) {
    contract.metadata = metadata
    return this.contractRepository.save(contract)
  }
}
