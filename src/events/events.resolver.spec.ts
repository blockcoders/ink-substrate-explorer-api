import { Test, TestingModule } from '@nestjs/testing'
import { EventsService } from 'src/events/events.service'
import { EventsResolver } from './events.resolver'

const eventsMocks = [
  {
    id: '09ff3513-d192-5957-b8d8-61ba3aec4fb1',
    contract: '5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t',
    transactionHash: '0x490e16ee0997d50a67c9eea3b885c092bf6483949d5f92f12a0925e92a9baad7',
    index: '0x0703',
    section: 'contracts',
    method: 'ContractEmitted',
    topics:
      '[0x0045726332303a3a5472616e7366657200000000000000000000000000000000, 0x2b00c7d40fe6d84d660f3e6bed90f218e022a0909f7e1a7ea35ada8b6e003564, 0xda2d695d3b5a304e0039e7fc4419c34fa0c1f239189c99bb72a6484f1634782b]',
    data: '["5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t","0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d018eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480010a5d4e80000000000000000000000"]',
    createdDate: '2022-08-25 22:49:21.66883',
  },
  {
    id: '181d7167-f23d-55d7-b403-248f62530fdd',
    contract: '5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t',
    transactionHash: '0xc70b40d973ab3147127efc61e71f532e425e23ebae9dc660146682bb2402b9c5',
    index: '0x0703',
    section: 'contracts',
    method: 'ContractEmitted',
    topics:
      '[0x0045726332303a3a5472616e7366657200000000000000000000000000000000, 0x33766995fd9b44bd45f351b3abd7e5041960638db0075c84ab7af1a734e20d1b, 0xda2d695d3b5a304e0039e7fc4419c34fa0c1f239189c99bb72a6484f1634782b]',
    data: '["5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t","0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d01d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0010a5d4e80000000000000000000000"]',
    createdDate: '2022-08-25 22:49:21.923151',
  },
]

describe('EventsResolver', () => {
  let resolver: EventsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsResolver,
        {
          provide: EventsService,
          useFactory: jest.fn(() => ({
            fetchEvents: () => eventsMocks,
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
        contract: eventsMocks[0].contract,
      })
      expect(events).toEqual(eventsMocks)
    })
  })
})
