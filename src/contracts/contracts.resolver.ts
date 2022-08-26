import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GraphQLUpload, FileUpload } from 'graphql-upload'
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
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @Args('contractAddress', { type: () => String }) contractAddress: String,
  ): Promise<Boolean> {
    const contract = await this.contractsService.findOne(contractAddress as string)
    if (!contract) {
      throw new Error('Contract does not exist')
    }
    return this.contractsService.uploadMetadata(contract, file)
  }
}
