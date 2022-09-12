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

  describe('createTransactionsFromExtrinsics', () => {
    it('should create transactions', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(null).mockResolvedValueOnce(null)
      jest
        .spyOn(repo, 'save')
        .mockResolvedValueOnce(mockSavedTransactions[0])
        .mockResolvedValueOnce(mockSavedTransactions[1])
      const blockHash = '0xffcfae3ecc9ab7b79fc0cd451dad35477a32219b219b29584b968826ac04c1a1'
      const savedTxs = await service.createTransactionsFromExtrinsics(mockExtrinsics as any, blockHash)
      mockSavedTransactions.forEach((tx, i) => {
        expect(savedTxs[i].hash).toEqual(tx.hash)
        expect(savedTxs[i].blockHash).toEqual(tx.blockHash)
        expect(savedTxs[i].nonce).toEqual(tx.nonce)
        expect(savedTxs[i].signature).toEqual(tx.signature)
        expect(savedTxs[i].signer).toEqual(tx.signer)
        expect(savedTxs[i].tip).toEqual(tx.tip)
        expect(savedTxs[i].method).toEqual(tx.method)
        expect(savedTxs[i].section).toEqual(tx.section)
      })
      expect(repo.create).toBeCalledTimes(2)
      expect(repo.save).toBeCalledTimes(2)
    })

    it('should skip creation of already existing transactions', async () => {
      jest
        .spyOn(repo, 'findOneBy')
        .mockResolvedValueOnce(mockSavedTransactions[0])
        .mockResolvedValueOnce(mockSavedTransactions[1])
      const blockHash = '0xffcfae3ecc9ab7b79fc0cd451dad35477a32219b219b29584b968826ac04c1a1'
      const savedTxs = await service.createTransactionsFromExtrinsics(mockExtrinsics as any, blockHash)
      mockSavedTransactions.forEach((tx, i) => {
        expect(savedTxs[i].hash).toEqual(tx.hash)
        expect(savedTxs[i].blockHash).toEqual(tx.blockHash)
        expect(savedTxs[i].nonce).toEqual(tx.nonce)
        expect(savedTxs[i].signature).toEqual(tx.signature)
        expect(savedTxs[i].signer).toEqual(tx.signer)
        expect(savedTxs[i].tip).toEqual(tx.tip)
        expect(savedTxs[i].method).toEqual(tx.method)
        expect(savedTxs[i].section).toEqual(tx.section)
      })
      expect(repo.create).toBeCalledTimes(2)
      expect(repo.save).toBeCalledTimes(0)
      expect(repo.findOneBy).toBeCalledTimes(2)
    })

    it('should fail if it cannot connect to database', async () => {
      try {
        jest.spyOn(repo, 'findOneBy').mockResolvedValue(Promise.reject("Can't connect to database"))
        const blockHash = '0xffcfae3ecc9ab7b79fc0cd451dad35477a32219b219b29584b968826ac04c1a1'
        await service.createTransactionsFromExtrinsics(mockExtrinsics as any, blockHash)
        fail("Shouldn't reach this point")
      } catch (error) {
        expect(error).toEqual("Can't connect to database")
      }
    })
  })
})
