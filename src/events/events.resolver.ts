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
/*
events.forEach(async (e) => {
          try {
            const event = await this.eventsService.findById(e.id)
            if (!event) throw new Error(`NOT FOUND WITH ID: ${e.id}`)
            if (event.method === 'ContractEmitted')
              console.log(
                '%j',
                this.eventsService.formatDecoded(this.eventsService.decodeContractEmittedEvent(erc20, event.data)),
              )
          } catch (error) {
            console.warn(error)
          }
        })*/