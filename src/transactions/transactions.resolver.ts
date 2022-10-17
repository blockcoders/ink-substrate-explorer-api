import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FetchEventsInput } from '../events/dtos/fetch-events.input'
import { Event } from '../events/entity/event.entity'
import { EventsService } from '../events/events.service'
import { FetchTransactionsByContractInput } from './dtos/fetch-transactions-by-contract.input'
import { FetchTransactionsInput } from './dtos/fetch-transactions.input'
import { Transaction } from './entity/transaction.entity'
import { TransactionsService } from './transactions.service'

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private transactionsService: TransactionsService, private eventsService: EventsService) {}
  @Query(/* istanbul ignore next */ () => Transaction)
  async getTransaction(@Args('hash', { type: () => String }) hash: string) {
    return this.transactionsService.findOne(hash)
  }

  @Query(/* istanbul ignore next */ () => [Transaction])
  async getTransactions(@Args() args: FetchTransactionsInput) {
    return this.transactionsService.fetchTransactions(args)
  }

  @Query(/* istanbul ignore next */ () => [Transaction])
  async getTransactionsByAddress(@Args() args: FetchTransactionsByContractInput) {
    return this.transactionsService.getTransactionsByContractAddress(args)
  }

  @ResolveField('events', /* istanbul ignore next */ () => [Event])
  async getEvents(@Parent() transaction: Transaction) {
    const { hash } = transaction
    const args: FetchEventsInput = {
      transactionHash: hash,
    }
    return this.eventsService.fetchEvents(args)
  }
}
