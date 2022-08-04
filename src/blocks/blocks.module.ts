import { Module } from '@nestjs/common'
import { DBModule } from 'src/db/db.module'
import { TransactionsService } from '../transactions/transactions.service'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'

@Module({
  imports: [DBModule],
  providers: [BlocksResolver, BlocksService, TransactionsService],
})
export class BlocksModule {}
