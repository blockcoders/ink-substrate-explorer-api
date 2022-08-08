import { Args, Query, Resolver } from '@nestjs/graphql'
import { Event } from './entity/event.entity'
import { EventsService } from './events.service'

@Resolver(() => Event)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}
  @Query(() => [Event])
  async getEvent(@Args('contractAddress', { type: () => String }) contract: string) {
    return this.eventsService.findAll(contract)
  }
}
