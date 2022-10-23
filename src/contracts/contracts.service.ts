import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Abi, ContractPromise } from '@polkadot/api-contract'
import { ContractOptions } from '@polkadot/api-contract/types'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Repository } from 'typeorm'
import { connect } from '../utils'
import { ExecuteQueryInput } from './dtos/execute-query.input'
import { FetchContractsInput } from './dtos/fetch-contracts.input'
import { Contract, ContractQuery, QueryResult } from './entity/contract.entity'
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

  async executeQuery({ address, method, args }: ExecuteQueryInput): Promise<QueryResult> {
    const api = await connect(WS_PROVIDER)
    const contract = await this.findOne(address)
    const { metadata } = contract || {}
    if (!metadata) {
      throw new Error('Contract metadata not found')
    }
    const abi = new Abi(metadata)
    const contractPromise = new ContractPromise(api, abi, address)
    const query = contractPromise.query[method]
    if (!query) {
      throw new Error('Query not found')
    }
    const { sender, options, values } = args || {}
    const { debugMessage, gasConsumed, gasRequired, output, result, storageDeposit } = await query(
      sender as string,
      options as ContractOptions,
      ...(values || []),
    )
    return {
      debugMessage: debugMessage.toHuman() || '',
      gasConsumed: gasConsumed.toString() || '',
      gasRequired: gasRequired.toString() || '',
      output: output?.toString() || '',
      result: result.toString() || '',
      storageDeposit: storageDeposit.toString() || '',
    }
  }
}

/*const contractOptions: ContractOptions = {
      gasLimit: 200_000_000_000_000,
      storageDepositLimit: undefined,
      value: undefined,
    }*/
/*const totalSupply = await contractPromise.query.totalSupply(ALICE_ADDRESS, contractOptions)
    printResult('totalSupply', totalSupply)
    const balanceOf = await contractPromise.query.balanceOf(ALICE_ADDRESS, contractOptions, BOB_ADDRESS)
    printResult('balanceOf', balanceOf)
    const approve = await contractPromise.query.approve(
      ALICE_ADDRESS,
      contractOptions,
      BOB_ADDRESS,
      1000_000_000_000_000,
    )
    printResult('approve', approve)
    const allowance = await contractPromise.query.allowance(ALICE_ADDRESS, contractOptions, ALICE_ADDRESS, BOB_ADDRESS)
    printResult('allowance', allowance)*/
/*
const ALICE_ADDRESS = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
const BOB_ADDRESS = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
const printResult = (method: string, r: any) => {
  console.log(`\n${method.toUpperCase()}:`)
  const { gasRequired, result, output } = r
  console.log('RESULT', result.toHuman())

  // the gas consumed for contract execution
  console.log('GAS REQUIRED', gasRequired.toHuman())

  // check if the call was successful
  if (result.isOk) {
    // output the return value
    console.log('Success', output?.toHuman())
  } else {
    console.log('Error', result.asErr.toHuman())
  }
}*/
