import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Transaction from '../transactions/transaction.entity'
import { TransactionsModule } from '../transactions/transactions.module'
import { TransactionsService } from '../transactions/transactions.service'
import Block from './block.entity'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'

@Module({
  imports: [TypeOrmModule.forFeature([Block, Transaction]), TransactionsModule],
  providers: [BlocksResolver, BlocksService, TransactionsService],
})
export class BlocksModule {}
