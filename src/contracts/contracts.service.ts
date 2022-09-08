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

  async findOne(address: string): Promise<Contract> {
    const contract = await this.contractRepository.findOneBy({ address })
    if (!contract) {
      throw new NotFoundException(`Contract with address: ${address} not found`)
    }
    return contract
  }

  async uploadMetadata(contract: Contract, metadata: string): Promise<boolean> {
    try {
      const buff = Buffer.from(metadata, 'base64')
      const abiJson = buff.toString('ascii')
      contract.metadata = abiJson
      await this.contractRepository.save(contract)
    } catch (error) {
      // console.error('Error: %j', error)
      return false
    }
    return true
  }
}
