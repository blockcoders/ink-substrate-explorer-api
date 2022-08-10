import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateEventInput } from './dtos/create-event.input'
import { FetchEventsInput } from './dtos/fetch-events.input'
import { Event } from './entity/event.entity'

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventInput: CreateEventInput): Promise<Event> {
    return this.eventRepository.save(createEventInput)
  }

  async fetchEvents(args: FetchEventsInput): Promise<Event[]> {
    return this.eventRepository.find(args)
  }
}
