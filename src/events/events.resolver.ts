import { Args, Query, Resolver } from '@nestjs/graphql'
import { FetchEventsInput } from './dtos/fetch-events.input'
import { Event } from './entity/event.entity'
import { EventsService } from './events.service'

@Resolver(() => Event)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}
  @Query(() => [Event])
  async getEvents(@Args() args: FetchEventsInput) {
    return this.eventsService.fetchEvents(args)
  }
}
