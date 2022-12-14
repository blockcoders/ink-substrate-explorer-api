/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GenericExtrinsic } from '@polkadot/types'
import { Vec } from '@polkadot/types-codec'
import { AnyTuple, ArgsDef } from '@polkadot/types-codec/types'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { MongoRepository } from 'typeorm'
import { FetchTransactionsByContractInput } from './dtos/fetch-transactions-by-contract.input'
import { FetchTransactionsInput } from './dtos/fetch-transactions.input'
import { Transaction } from './entity/transaction.entity'
const retry = require('async-await-retry')

@Injectable()
export class TransactionsService {
  constructor(
    @InjectPinoLogger(TransactionsService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(Transaction)
    private readonly transactionRepository: MongoRepository<Transaction>,
  ) {}

  async findOne(hash: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ hash })
    if (!transaction) {
      throw new NotFoundException(`Transaction with hash: ${hash} not found`)
    }
    return transaction
  }

  async fetchTransactions(args: FetchTransactionsInput): Promise<Transaction[]> {
    const { skip, take, blockHash, orderAsc } = args
    const where: any = {}

    if (blockHash) {
      where['blockHash'] = blockHash
    }

    return this.transactionRepository.find({
      skip,
      take,
      where,
      order: { timestamp: orderAsc ? 'ASC' : 'DESC' },
    })
  }

  async createTransactionsFromExtrinsics(
    extrinsics: Vec<GenericExtrinsic<AnyTuple>>,
    blockHash: string,
    timestamp: number,
  ): Promise<Transaction[]> {
    return Promise.all(
      extrinsics.map(async (extrinsic) => {
        try {
          const {
            hash: transactionHash,
            nonce,
            signature,
            signer,
            encodedLength,
            registry,
            tip,
            era,
            version,
            type,
            callIndex,
          } = extrinsic
          const { method, section, args, argsDef } = extrinsic.method
          const formattedArgs = this.formatArgs(args, argsDef)
          const tx = this.transactionRepository.create({
            hash: transactionHash.toString().toLowerCase(),
            blockHash: blockHash.toLowerCase(),
            section,
            method,
            signature: signature.toString(),
            signer: signer.toString(),
            nonce: nonce.toNumber(),
            tip: tip.toString(),
            timestamp,
            version,
            type: type,
            encodedLength,
            callIndex: callIndex?.toString(),
            decimals: registry?.chainDecimals?.toString(),
            ss58: registry?.chainSS58?.toString(),
            tokens: registry?.chainTokens?.toString(),
            era: JSON.stringify(era),
            args: JSON.stringify(formattedArgs),
          })
          const transaction = await retry(
            async () => {
              const existing = await this.transactionRepository.findOneBy({ hash: tx.hash })
              return existing || (await this.transactionRepository.save(tx))
            },
            undefined,
            {
              retriesMax: 3,
              interval: 100,
              exponential: true,
            },
          )
          return transaction
        } catch (error) {
          this.logger.error({ error }, 'Error creating transaction.')
          throw error
        }
      }),
    )
  }

  // This function creates a new object with the same keys as the argsDef object and the values from the args object
  formatArgs(args: AnyTuple, argsDef: ArgsDef) {
    if (!argsDef) return args
    const formattedArgs: any = {}
    Object.keys(argsDef).forEach((key: any, index) => {
      formattedArgs[key] = args[index]
    })
    return formattedArgs
  }

  async getTransactionsByContractAddress(args: FetchTransactionsByContractInput): Promise<Transaction[]> {
    const { skip = 0, take = 10, address, orderAsc } = args
    const a = await this.transactionRepository
      .aggregate([
        {
          $lookup: {
            from: 'events',
            let: { tx: '$hash' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$transactionHash', '$$tx'],
                      },
                      {
                        $eq: ['$contract.address', address],
                      },
                    ],
                  },
                },
              },
              {
                $project: { _id: 1, contract: 1 },
              },
            ],
            as: 'events',
          },
        },
        {
          $match: {
            $expr: { $gte: [{ $size: '$events' }, 1] },
          },
        },
      ])
      .limit(take)
      .skip(skip)
      .sort({ timestamp: orderAsc ? 1 : -1 })

    const arr = await a.toArray()
    return arr as any
  }
}
