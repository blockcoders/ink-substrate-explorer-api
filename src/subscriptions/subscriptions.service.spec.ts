import { Test, TestingModule } from '@nestjs/testing'
import { mockBlock } from '../../mocks/blocks-mocks'
import { mockExtrinsics, mockTransactions } from '../../mocks/transactions-mock'
import { BlocksService } from '../blocks/blocks.service'
import { TransactionsService } from '../transactions/transactions.service'
import { SubscriptionsService } from './subscriptions.service'
import { EventsService } from '../events/events.service'
import { mockEvents } from '../../mocks/events-mocks'
import { ApiPromise } from '@polkadot/api'
import { apiMock } from '../../mocks/api-mock'
jest.mock('@polkadot/api')

describe('subscriptionsService', () => {
  let service: SubscriptionsService
  let api: ApiPromise

  beforeAll(async () => {
    const MockedApi = ApiPromise as jest.MockedClass<typeof ApiPromise>
    MockedApi.create = jest.fn().mockResolvedValue(apiMock)
    api = await MockedApi.create()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: BlocksService,
          useValue: {
            createFromHeader: jest.fn().mockResolvedValue(mockBlock),
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            createTransactionsFromExtrinsics: jest.fn().mockResolvedValue(mockTransactions),
          },
        },
        {
          provide: EventsService,
          useValue: {
            createEventsFromRecords: jest.fn().mockResolvedValue(mockEvents),
          },
        },
      ],
    }).compile()

    service = module.get<SubscriptionsService>(SubscriptionsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('registerBlockData', () => {
    it('should return the registered block', async () => {
      const number = {
        toHex: () => '27',
      }

      const header = {
        hash: mockBlock.hash,
        parentHash: mockBlock.parentHash,
        number,
      }
      const result = await service.registerBlockData(header, mockExtrinsics, [])
      expect(result).toEqual(mockBlock)
    })
  })

  describe('processBlock', () => {
    it('should return the block hash', async () => {
      const number = 27
      const result = await service.processBlock(api, number)
      expect(result).toEqual(mockBlock.hash)
    })
  })
})
