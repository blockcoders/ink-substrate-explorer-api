import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Block from '../models/block.entity'
import Transaction from '../models/transaction.entity'
import { BlocksResolver } from '../resolvers/blocks.resolver'
import { BlocksService } from '../services/blocks.service'
import { TransactionsService } from '../services/transactions.service'
import { TransactionsModule } from './transactions.module'

@Module({
  imports: [TypeOrmModule.forFeature([Block, Transaction]), TransactionsModule],
  providers: [BlocksResolver, BlocksService, TransactionsService],
})
export class BlocksModule {}
