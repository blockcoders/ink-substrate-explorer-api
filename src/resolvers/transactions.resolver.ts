import { Args, Query, Resolver } from '@nestjs/graphql'
import Transaction from '../models/transaction.entity'
import { TransactionsService } from '../services/transactions.service'

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private transactionsService: TransactionsService) {}

  @Query(() => Transaction)
  async getTransaction(@Args('hash', { type: () => String }) hash: string) {
    return this.transactionsService.findOne(hash)
  }
}
