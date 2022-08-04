import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Transaction from './transaction.entity'
import { TransactionsResolver } from './transactions.resolver'
import { TransactionsService } from './transactions.service'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
