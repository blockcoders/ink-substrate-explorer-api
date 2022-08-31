import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FetchTransactionsInput } from '../transactions/dtos/fetch-transactions.input'
import { Transaction } from '../transactions/entity/transaction.entity'
import { TransactionsService } from '../transactions/transactions.service'
import { BlocksService } from './blocks.service'
import { FetchBlocksInput } from './dtos/fetch-blocks.input'
import { Block } from './entity/block.entity'

@Resolver(() => Block)
export class BlocksResolver {
  constructor(private blocksService: BlocksService, private transactionsService: TransactionsService) {}
  @Query(() => Block)
  async getBlock(@Args('hash', { type: () => String }) hash: string) {
    return this.blocksService.findOne(hash)
  }

  @Query(() => [Block])
  async getBlocks(@Args() args: FetchBlocksInput) {
    return this.blocksService.fetchBlocks(args)
  }

  @ResolveField('transactions', () => [Transaction])
  async getTransactions(@Parent() block: Block) {
    const { hash } = block
    const args: FetchTransactionsInput = {
      blockHash: hash,
    }
    return this.transactionsService.fetchTransactions(args)
  }
}
