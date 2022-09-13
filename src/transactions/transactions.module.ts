import { Module } from '@nestjs/common'
import { EnvModule } from 'src/env/env.module'
import { DBModule } from '../db/db.module'
import { EventsModule } from '../events/events.module'
import { TransactionsResolver } from './transactions.resolver'
import { TransactionsService } from './transactions.service'

@Module({
  imports: [EnvModule, DBModule, EventsModule],
  providers: [TransactionsResolver, TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
