import { Test, TestingModule } from '@nestjs/testing'
import { mockDecodedEvent, mockEvents } from '../../mocks/events-mocks'
import { EventsService } from '../events/events.service'
import { FetchEventsInput } from './dtos/fetch-events.input'
import { EventsResolver } from './events.resolver'

describe('EventsResolver', () => {
  let resolver: EventsResolver
  let eventService: EventsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsResolver,
        {
          provide: EventsService,
          useFactory: jest.fn(() => ({
            findById: () => mockEvents[0],
            fetchEvents: () => mockEvents,
            decodeEvents: () => mockDecodedEvent,
          })),
        },
      ],
    }).compile()

    resolver = module.get<EventsResolver>(EventsResolver)
    eventService = module.get<EventsService>(EventsService)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('getEvents', () => {
    it('should get events by contract address', async () => {
      const events = await resolver.getEvents({
        skip: 0,
        take: 10,
        contract: mockEvents[0].contractAddress,
      })
      expect(events).toEqual(mockEvents)
    })
  })

  describe('decodeEvents', () => {
    it('should return decoded events for a contract address', () => {
      const args: FetchEventsInput = {
        skip: 0,
        take: 10,
        contract: mockEvents[0].contractAddress,
      }
      expect(resolver.decodeEvents(args)).resolves.toEqual(JSON.stringify(mockDecodedEvent))
    })

    it('should return an error message', () => {
      const args: FetchEventsInput = {
        skip: 0,
        take: 10,
        contract: mockEvents[0].contractAddress,
      }
      jest.spyOn(eventService, 'decodeEvents').mockRejectedValue(Promise.reject('Contract not found'))
      expect(resolver.decodeEvents(args)).rejects.toBe('Contract not found')
    })
  })

  describe('decodeEvent', () => {
    it('should return a decoded event', () => {
      const { contractAddress, id } = mockEvents[0]
      expect(resolver.decodeEvent(contractAddress, id)).resolves.toEqual(JSON.stringify(mockDecodedEvent))
    })

    it('should return an error message', () => {
      const { contractAddress, id } = mockEvents[0]
      jest.spyOn(eventService, 'findById').mockRejectedValue(Promise.reject('Event not found'))
      expect(resolver.decodeEvent(contractAddress, id)).rejects.toBe('Event not found')
    })
  })

  describe('data', () => {
    it('should return the data from an event', () => {
      expect(resolver.data(mockEvents[0] as any)).resolves.toEqual(JSON.stringify(mockEvents[0].data))
    })
  })
})
