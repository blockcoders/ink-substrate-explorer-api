import { Test, TestingModule } from '@nestjs/testing'
import { mockEvents } from '../../mocks/events-mocks'
import { mockTransaction, mockTransactions } from '../../mocks/transactions-mock'
import { EventsModule } from '../events/events.module'
import { EventsService } from '../events/events.service'
import { TransactionsResolver } from './transactions.resolver'
import { TransactionsService } from './transactions.service'

describe('TransactionsResolver', () => {
  let resolver: TransactionsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventsModule],
      providers: [
        TransactionsResolver,
        {
          provide: TransactionsService,
          useFactory: jest.fn(() => ({
            findOne: () => mockTransaction,
            fetchTransactions: () => mockTransactions,
          })),
        },
        {
          provide: EventsService,
          useFactory: jest.fn(() => ({
            fetchEvents: () => mockEvents,
          })),
        },
      ],
    }).compile()

    resolver = module.get<TransactionsResolver>(TransactionsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('getTransaction', () => {
    it('should get a transaction by hash', async () => {
      const transcation = await resolver.getTransaction(mockTransaction.hash)
      expect(transcation).toEqual(mockTransaction)
    })
  })

  describe('getTransactions', () => {
    it('should get all blocks', async () => {
      const transactions = await resolver.getTransactions({
        blockHash: mockTransactions[0].hash,
        skip: 0,
        take: 20,
      })
      expect(transactions).toEqual(mockTransactions)
    })

    it('should obtain all transactions in a block', async () => {
      const transactions = await resolver.getEvents({
        hash: mockEvents[0].transactionHash,
      } as any)
      expect(transactions).toEqual(mockEvents)
    })
  })
})
