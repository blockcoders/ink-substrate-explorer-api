import { Test, TestingModule } from '@nestjs/testing'
import { mockEvents } from '../../mocks/events-mocks'
import { EventsService } from '../events/events.service'
import { EventsResolver } from './events.resolver'

describe('EventsResolver', () => {
  let resolver: EventsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsResolver,
        {
          provide: EventsService,
          useFactory: jest.fn(() => ({
            fetchEvents: () => mockEvents,
          })),
        },
      ],
    }).compile()

    resolver = module.get<EventsResolver>(EventsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('getEvents', () => {
    it('should get a transaction by hash', async () => {
      const events = await resolver.getEvents({
        skip: 0,
        take: 10,
        contract: mockEvents[0].contractAddress,
      })
      expect(events).toEqual(mockEvents)
    })
  })
})
