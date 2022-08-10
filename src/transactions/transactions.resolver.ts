import { Args, Query, Resolver } from '@nestjs/graphql'
import { FetchTransactionsInput } from './dtos/fetch-transactions.input'
import { Transaction } from './entity/transaction.entity'
import { TransactionsService } from './transactions.service'

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private transactionsService: TransactionsService) {}
  @Query(() => Transaction)
  async getTransaction(@Args('hash', { type: () => String }) hash: string) {
    return this.transactionsService.findOne(hash)
  }

  @Query(() => [Transaction])
  async getTransactions(@Args() args: FetchTransactionsInput) {
    return this.transactionsService.fetchTransactions(args)
  }
}
