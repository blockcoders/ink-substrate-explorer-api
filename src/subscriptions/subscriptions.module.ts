import { Module } from '@nestjs/common'
import { BlocksModule } from '../blocks/blocks.module'
import { ContractsModule } from '../contracts/contracts.module'
import { EventsModule } from '../events/events.module'
import { TransactionsModule } from '../transactions/transactions.module'
import { SubscriptionsService } from './subscriptions.service'

@Module({
  providers: [SubscriptionsService],
  imports: [BlocksModule, EventsModule, TransactionsModule, ContractsModule],
})
export class SubscriptionsModule {}
