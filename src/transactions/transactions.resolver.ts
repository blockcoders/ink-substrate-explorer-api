import { Args, Query, Resolver } from '@nestjs/graphql'
import Transaction from './transaction.entity'
import { TransactionsService } from './transactions.service'

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private transactionsService: TransactionsService) {}

  @Query(() => Transaction)
  async getTransaction(@Args('hash', { type: () => String }) hash: string) {
    return this.transactionsService.findOne(hash)
  }
}
