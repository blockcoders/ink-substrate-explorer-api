import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FetchEventsInput } from '../events/dtos/fetch-events.input'
import { Event } from '../events/entity/event.entity'
import { EventsService } from '../events/events.service'
import { ContractsService } from './contracts.service'
import { ExecuteQueryInput } from './dtos/execute-query.input'
import { Contract, ContractQuery, QueryResult } from './entity/contract.entity'

@Resolver(() => Contract)
export class ContractsResolver {
  constructor(private contractsService: ContractsService, private eventsService: EventsService) {}

  @Query(/* istanbul ignore next */ () => Contract)
  async getContract(@Args('address', { type: () => String }) address: string) {
    return this.contractsService.findOne(address)
  }

  @Query(/* istanbul ignore next */ () => Contract)
  async getContractQueries(@Args('address', { type: () => String }) address: string) {
    return this.contractsService.getContractQueries(address)
  }

  @Mutation(/* istanbul ignore next */ () => QueryResult)
  async executeQuery(@Args() parameters: ExecuteQueryInput) {
    return this.contractsService.executeQuery(parameters)
  }

  @Mutation(/* istanbul ignore next */ () => Boolean)
  async uploadMetadata(
    @Args('metadata', { type: /* istanbul ignore next */ () => String }) metadata: string,
    @Args('contractAddress', { type: /* istanbul ignore next */ () => String }) contractAddress: string,
  ): Promise<boolean> {
    if (Buffer.from(metadata, 'base64').toString('base64') !== metadata) {
      throw new Error('Invalid metadata')
    }

    const contract = await this.contractsService.findOne(contractAddress as string)
    return this.contractsService.uploadMetadata(contract, metadata)
  }

  @ResolveField('events', /* istanbul ignore next */ () => [Event])
  async getEvents(@Parent() contract: Contract) {
    const { address } = contract
    const args: FetchEventsInput = {
      contract: address,
    }
    return this.eventsService.fetchEvents(args)
  }

  @ResolveField('queries', /* istanbul ignore next */ () => [ContractQuery])
  async queries(@Parent() contract: Contract) {
    const { queries } = contract
    if (!queries) {
      return []
    }
    queries.forEach((query) => {
      query.args = query.args.map((arg) => JSON.stringify(arg))
    })
    return queries
  }
}
