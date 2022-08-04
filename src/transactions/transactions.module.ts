import { Module } from '@nestjs/common'
import { DBModule } from 'src/db/db.module'
import { TransactionsResolver } from './transactions.resolver'
import { TransactionsService } from './transactions.service'

@Module({
  imports: [DBModule],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
