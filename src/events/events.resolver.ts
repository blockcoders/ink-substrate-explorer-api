import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FetchEventsInput } from './dtos/fetch-events.input'
import { Event } from './entity/event.entity'
import { EventsService } from './events.service'

@Resolver(() => Event)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}
  @Query(/* istanbul ignore next */ () => [Event])
  async getEvents(@Args() args: FetchEventsInput) {
    return this.eventsService.fetchEvents(args)
  }

  @Query(/* istanbul ignore next */ () => Event)
  async getEvent(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.findById(id)
  }

  @Mutation(/* istanbul ignore next */ () => String)
  async decodeEvents(@Args() args: FetchEventsInput) {
    try {
      const events = await this.eventsService.fetchEvents(args)
      const decodedEvents = await this.eventsService.decodeEvents(events, args.contract as string)
      return JSON.stringify(decodedEvents)
    } catch (error) {
      return error
    }
  }

  @Mutation(/* istanbul ignore next */ () => String)
  async decodeEvent(
    @Args('contractAddress', { type: () => String }) contractAddress: string,
    @Args('id', { type: () => String }) id: string,
  ) {
    try {
      const event = await this.eventsService.findById(id)
      if (!event) {
        throw new Error('Event not found')
      }
      const response = await this.eventsService.decodeEvents([event], contractAddress as string)
      return JSON.stringify(response)
    } catch (error) {
      return error
    }
  }

  @ResolveField('data', /* istanbul ignore next */ () => String)
  async data(@Parent() event: Event) {
    const { data } = event
    return JSON.stringify(data)
  }

  @ResolveField('decodedData', /* istanbul ignore next */ () => String)
  async decodedData(@Parent() event: Event) {
    const { decodedData } = event
    if (!decodedData) {
      return ''
    }
    return JSON.stringify(decodedData)
  }

  @ResolveField('formattedData', /* istanbul ignore next */ () => String)
  async formattedData(@Parent() event: Event) {
    const { decodedData } = event
    if (!decodedData) {
      return ''
    }
    return JSON.stringify(this.eventsService.formatDecoded(decodedData))
  }
}
