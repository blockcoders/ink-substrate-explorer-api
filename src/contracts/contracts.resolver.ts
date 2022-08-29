import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ContractsService } from './contracts.service'
import { Contract } from './entity/contract.entity'

@Resolver(() => Contract)
export class ContractsResolver {
  constructor(private contractsService: ContractsService) {}

  @Query(() => Contract)
  async getContract(@Args('hash', { type: () => String }) hash: string) {
    return this.contractsService.findOne(hash)
  }

  @Mutation(() => Boolean)
  async uploadMetadata(
    @Args('metadata', { type: () => String }) metadata: string,
    @Args('contractAddress', { type: () => String }) contractAddress: string,
  ): Promise<boolean> {
    if (Buffer.from(metadata, 'base64').toString('base64') !== metadata) {
      throw new Error('Invalid metadata')
    }

    const contract = await this.contractsService.findOne(contractAddress as string)
    if (!contract) {
      throw new Error('Contract does not exist')
    }
    return this.contractsService.uploadMetadata(contract, metadata)
  }
}
