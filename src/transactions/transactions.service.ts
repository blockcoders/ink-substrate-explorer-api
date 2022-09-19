/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GenericExtrinsic } from '@polkadot/types'
import { Vec } from '@polkadot/types-codec'
import { AnyTuple } from '@polkadot/types-codec/types'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Repository } from 'typeorm'
import { FetchTransactionsInput } from './dtos/fetch-transactions.input'
import { Transaction } from './entity/transaction.entity'
const retry = require('async-await-retry')

@Injectable()
export class TransactionsService {
  constructor(
    @InjectPinoLogger(TransactionsService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findOne(hash: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ hash })
    if (!transaction) {
      throw new NotFoundException(`Transaction with hash: ${hash} not found`)
    }
    return transaction
  }

  async fetchTransactions(args: FetchTransactionsInput): Promise<Transaction[]> {
    const { skip, take, blockHash } = args
    return this.transactionRepository.find({ skip, take, where: { blockHash } })
  }

  async createTransactionsFromExtrinsics(
    extrinsics: Vec<GenericExtrinsic<AnyTuple>>,
    blockHash: string,
  ): Promise<Transaction[]> {
    return Promise.all(
      extrinsics.map(async (extrinsic) => {
        try {
          const { hash: transactionHash, nonce, signature, signer, tip } = extrinsic
          const { method, section } = extrinsic.method
          const tx = this.transactionRepository.create({
            hash: transactionHash.toString().toLowerCase(),
            method: method,
            section: section,
            nonce: nonce.toNumber(),
            signature: signature.toString(),
            signer: signer.toString(),
            tip: tip.toNumber(),
            blockHash: blockHash.toLowerCase(),
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
}
