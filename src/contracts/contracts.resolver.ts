import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { EventsService } from '../events/events.service'
import { FetchEventsInput } from '../events/dtos/fetch-events.input'
import { Event } from '../events/entity/event.entity'
import { ContractsService } from './contracts.service'
import { Contract } from './entity/contract.entity'

@Resolver(() => Contract)
export class ContractsResolver {
  constructor(private contractsService: ContractsService, private eventsService: EventsService) {}

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

  @ResolveField('events', () => [Event])
  async getEvents(@Parent() contract: Contract) {
    const { address } = contract
    const args: FetchEventsInput = {
      contract: address,
    }
    return this.eventsService.fetchEvents(args)
  }
}
