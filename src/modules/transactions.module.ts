import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Transaction from '../models/transaction.entity'
import { TransactionsResolver } from '../resolvers/transactions.resolver'
import { TransactionsService } from '../services/transactions.service'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
