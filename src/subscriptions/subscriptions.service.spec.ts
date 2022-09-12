import { Test, TestingModule } from '@nestjs/testing'
import { mockBlock } from '../../mocks/blocks-mocks'
import { mockExtrinsics, mockTransactions } from '../../mocks/transactions-mock'
import { BlocksService } from '../blocks/blocks.service'
import { TransactionsService } from '../transactions/transactions.service'
import { SubscriptionsService } from './subscriptions.service'
import { EventsService } from '../events/events.service'
import { mockEvents } from '../../mocks/events-mocks'

describe('subscriptionsService', () => {
  let service: SubscriptionsService

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
    it('should return an object with block and transactions attributes', () => {
      const number = {
        toHex: () => '27',
      }

      const header = {
        hash: mockBlock.hash,
        parentHash: mockBlock.parentHash,
        number,
      }

      expect(service.registerBlockData(header, mockExtrinsics, [])).resolves.toEqual({
        block: mockBlock,
        transactions: mockTransactions,
      })
    })
  })
})
