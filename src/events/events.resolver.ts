import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
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

  @Query(() => String)
  async decodeEvents(@Args('contractAddress', { type: () => String }) contractAddress: string) {
    const events = await this.eventsService.fetchEvents({ contract: contractAddress as string })
    const response = await this.eventsService.decodeEvents(events, contractAddress as string)
    return JSON.stringify(response)
  }
  
  @ResolveField('data', () => String)
  async data(@Parent() event: Event) {
    const { data } = event
    return JSON.stringify(data)
  }
}
