import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Abi, ContractPromise } from '@polkadot/api-contract'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Repository } from 'typeorm'
import { connect } from '../utils'
import { FetchContractsInput } from './dtos/fetch-contracts.input'
import { Contract, ContractQuery } from './entity/contract.entity'
const WS_PROVIDER = process.env.WS_PROVIDER || 'ws://127.0.0.1:9944'

@Injectable()
export class ContractsService {
  constructor(
    @InjectPinoLogger(ContractsService.name)
    private readonly logger: PinoLogger,
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

  async fetchContracts(args: FetchContractsInput): Promise<Contract[]> {
    const { skip, take } = args
    return this.contractRepository.find({
      skip,
      take,
    })
  }

  async uploadMetadata(contract: Contract, metadata: string): Promise<boolean> {
    try {
      const buff = Buffer.from(metadata, 'base64')
      const abiJson = buff.toString('ascii')
      contract.metadata = abiJson
      await this.contractRepository.save(contract)
    } catch (error) {
      this.logger.error({ error }, 'Error uploading the metadata.')
      return false
    }
    return true
  }

  async getContractQueries(contractAddress: string): Promise<Contract> {
    const api = await connect(WS_PROVIDER)
    const contract = await this.findOne(contractAddress)
    const { address, metadata } = contract
    if (!address || !metadata) {
      this.logger.warn('Contract address or metadata not found')
      contract.queries = []
      return contract
    }
    const abi = new Abi(metadata)
    const contractPromise = new ContractPromise(api, abi, address)
    const contractQueries: ContractQuery[] = []
    Object.keys(contractPromise.query).map((k) => {
      const { method, docs, args, identifier } = contractPromise.query[k].meta
      contractQueries.push({
        method,
        docs,
        args,
        name: (identifier[0].toUpperCase() + identifier.substring(1)).replace('_', ' '),
      })
    })
    contract.queries = contractQueries
    return contract
  }
}
