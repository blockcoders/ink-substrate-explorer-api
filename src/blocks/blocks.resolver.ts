// import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
// import { TransactionsService } from '../transactions/transactions.service'
// import { BlocksService } from './blocks.service'

// @Resolver(() => Block)
export class BlocksResolver {
  // constructor(private blocksService: BlocksService, private transactionsService: TransactionsService) {}
  // @Query(() => Block)
  // async getBlock(@Args('hash', { type: () => String }) hash: string) {
  //   return this.blocksService.findOne(hash)
  // }
  // @ResolveField()
  // async getTransactions(@Parent() block: Block) {
  //   const { hash } = block
  //   return this.transactionsService.findByBlock(hash)
  // }
}
