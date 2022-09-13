import { Module } from '@nestjs/common'
import { DBModule } from '../db/db.module'
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'
import { TransactionsModule } from '../transactions/transactions.module'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'

@Module({
  imports: [DBModule, TransactionsModule, SubscriptionsModule],
  providers: [BlocksResolver, BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
