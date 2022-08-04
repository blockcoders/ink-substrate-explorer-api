import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Block from './block.entity'
import Transaction from '../transactions/transaction.entity'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'
import { TransactionsService } from '../transactions/transactions.service'
import { TransactionsModule } from '../transactions/transactions.module'

@Module({
  imports: [TypeOrmModule.forFeature([Block, Transaction]), TransactionsModule],
  providers: [BlocksResolver, BlocksService, TransactionsService],
})
export class BlocksModule {}
