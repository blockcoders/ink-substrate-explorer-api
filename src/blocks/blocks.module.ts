import { Module } from '@nestjs/common'
import { DBModule } from 'src/db/db.module'
import { TransactionsModule } from 'src/transactions/transactions.module'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'

@Module({
  imports: [DBModule, TransactionsModule],
  providers: [BlocksResolver, BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
