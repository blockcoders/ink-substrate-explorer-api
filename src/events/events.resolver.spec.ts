import { Test, TestingModule } from '@nestjs/testing'
import { mockDecodedEvent, mockEvents, mockFormattedEvent } from '../../mocks/events-mocks'
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
            formatDecoded: () => mockFormattedEvent,
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

  describe('getEvent', () => {
    it('should get the event by id', async () => {
      const event = await resolver.getEvent(mockEvents[0].id)
      expect(event).toEqual(mockEvents[0])
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
      jest.spyOn(eventService, 'findById').mockRejectedValue(Promise.reject('Failed to find event'))
      expect(resolver.decodeEvent(contractAddress, id)).rejects.toBe('Failed to find event')
    })

    it('should return an error message', async () => {
      const { contractAddress, id } = mockEvents[0]
      jest.spyOn(eventService, 'findById').mockResolvedValueOnce(Promise.resolve(null))
      try {
        await resolver.decodeEvent(contractAddress, id)
      } catch (error) {
        expect((error as Error).message).toEqual('Event not found')
      }
    })
  })

  describe('get decoded data', () => {
    it('should return the decoded (empty) data from an event', () => {
      expect(resolver.decodedData(mockEvents[0] as any)).resolves.toEqual('')
    })

    it('should return the decoded data from an event', () => {
      expect(resolver.decodedData(mockEvents[1] as any)).resolves.toEqual(JSON.stringify(mockDecodedEvent))
    })
  })

  describe('get formatted data', () => {
    it('should return the formatted data (empty) from an event', () => {
      expect(resolver.formattedData(mockEvents[0] as any)).resolves.toEqual('')
    })

    it('should return the formatted data from an event', () => {
      expect(resolver.formattedData(mockEvents[1] as any)).resolves.toEqual(JSON.stringify(mockFormattedEvent))
    })
  })

  describe('data', () => {
    it('should return the data from an event', () => {
      expect(resolver.data(mockEvents[0] as any)).resolves.toEqual(JSON.stringify(mockEvents[0].data))
    })
  })
})
