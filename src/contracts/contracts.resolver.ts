import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ContractsService } from './contracts.service'
import { UploadMetadataInput } from './dtos/upload-metadata.input'
import { Contract } from './entity/contract.entity'

@Resolver(() => Contract)
export class ContractsResolver {
  constructor(private contractsService: ContractsService) {}

  @Query(() => Contract)
  async getContract(@Args('hash', { type: () => String }) hash: string) {
    return this.contractsService.findOne(hash)
  }

  @Mutation(() => Contract)
  async uploadMetadata(data: UploadMetadataInput) {
    const contract = await this.contractsService.findOne(data.hash)
    if (!contract) {
      throw new Error('Contract does not exist')
    }
    return this.contractsService.uploadMetadata(contract, data.metadata)
  }
}
