import { Module } from '@nestjs/common'
import { DBModule } from '../db/db.module'
import { EventsModule } from '../events/events.module'
import { TransactionsResolver } from './transactions.resolver'
import { TransactionsService } from './transactions.service'

@Module({
  imports: [DBModule, EventsModule],
  providers: [TransactionsResolver, TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
