import { Module } from '@nestjs/common'
import { EnvModule } from 'src/env/env.module'
import { DBModule } from '../db/db.module'
import { TransactionsModule } from '../transactions/transactions.module'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'

@Module({
  imports: [EnvModule, DBModule, TransactionsModule],
  providers: [BlocksResolver, BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
