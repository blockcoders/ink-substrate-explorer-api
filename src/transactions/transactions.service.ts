import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTransactionInput } from './dtos/create-transaction.input'
import Transaction from './transaction.entity'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionInput: CreateTransactionInput): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionInput)
    return await this.transactionRepository.save(transaction)
  }

  async findOne(hash: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ hash })
    if (!transaction) {
      throw new NotFoundException(`Transaction with hash: ${hash} not found`)
    }
    return transaction
  }

  async findByBlock(blockHash: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.findBy({ blockHash })
    if (!transactions) {
      throw new NotFoundException(`Transactions of block: ${blockHash} not found`)
    }
    return transactions
  }
}
