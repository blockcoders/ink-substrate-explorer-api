import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { mockExtrinsics, mockSavedTransactions, mockTransaction, mockTransactions } from '../../mocks/transactions-mock'
import { Transaction } from './entity/transaction.entity'
import { TransactionsService } from './transactions.service'

describe('TransactionsService', () => {
  let service: TransactionsService
  let repo: Repository<Transaction>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockTransaction),
            find: jest.fn().mockResolvedValue(mockTransactions),
            create: jest.fn().mockResolvedValue(mockSavedTransactions),

            save: jest.fn().mockResolvedValue(mockSavedTransactions),
          },
        },
      ],
    }).compile()

    service = module.get<TransactionsService>(TransactionsService)
    repo = module.get<Repository<Transaction>>(getRepositoryToken(Transaction))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    it('should get a single transaction', () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy')
      expect(service.findOne(mockTransaction.hash)).resolves.toEqual(mockTransaction)
      expect(repoSpy).toBeCalledWith({ hash: mockTransaction.hash })
    })

    it('should return not found error', () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(null)
      expect(service.findOne('123')).rejects.toThrow(NotFoundException)
      expect(repoSpy).toBeCalledWith({ hash: '123' })
    })
  })

  describe('fetchBlocks', () => {
    it('should get an array of transactions', async () => {
      const transactions = await service.fetchTransactions({ skip: 0, take: 2 })
      expect(transactions).toEqual(mockTransactions)
    })
  })

  describe.skip('createTransactionsFromExtrinsics', () => {
    it('should create transactions', () => {
      const blockHash = '0xffcfae3ecc9ab7b79fc0cd451dad35477a32219b219b29584b968826ac04c1a1'

      expect(service.createTransactionsFromExtrinsics(mockExtrinsics as any, blockHash)).resolves.toEqual([
        mockSavedTransactions,
        mockSavedTransactions,
      ])
      expect(repo.create).toBeCalledTimes(2)
      expect(repo.save).toBeCalledTimes(2)
    })
  })
})
