import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction } from './entity/transaction.entity'
import { TransactionsService } from './transactions.service'

const mockTransaction = {
  hash: '0x055878018de242a21b7bd4b9512f4c24217da75ab2b9bf4eb93e95247b1a8f42',
  blockHash: '0x5721a1e39a8097a6aa312be44baa46d869075d1bd94cf45410d99b113cc68af5',
  method: 'call',
  section: 'contracts',
  signature:
    '0xdcd2f242d04cf19bf4695606a4244da9c7ab1d7a71153bcc3010909294dcb633e14841e833f35de113f8400b9687f10b93a27d3940926ba434318a7fc639f986',
  signer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  nonce: 37,
  tip: 0,
  createdDate: '2022-08-25 23:42:49.006343',
}

const mockTransactions = [
  {
    hash: '0x0b359cb94c8a6a686a05e0368b4335a0c89fffb171c01eb7bc1c8bd72a530081',
    blockHash: '0x7e56e25320500d773f8c2a04f4376551c1bb978b21789a02fdb1f038f9a360b8',
    method: 'call',
    section: 'contracts',
    signature:
      '0xdcd2f242d04cf19bf4695606a4244da9c7ab1d7a71153bcc3010909294dcb633e14841e833f35de113f8400b9687f10b93a27d3940926ba434318a7fc639f986',
    signer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    nonce: 33,
    tip: 0,
    createdDate: '2022-08-25 22:49:21.987641',
  },
  {
    hash: '0x0baa3c53a333f8ec374b228ced770a9fff8de8ed007bc3d678717e04daed3d5b',
    blockHash: '0x0ed44ce6539552a4171dea020a79cdc6aebd58e93cd5e283c234f6357cee70c6',
    method: 'call',
    section: 'contracts',
    signature:
      '0x4eb9be0d2604225259ca3a0f183d424122f0fc6e2694e5d2f161f1c82b14fd5079ca525f9d89b1dbbfce666cbcf4ee843787f07c15993a26cb87ca24573bc087',
    signer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    nonce: 32,
    tip: 0,
    createdDate: '2022-08-25 22:49:21.96569',
  },
]

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
            create: jest.fn(),
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
  })

  describe('fetchBlocks', () => {
    it('should get an array of transactions', async () => {
      const transactions = await service.fetchTransactions({ skip: 0, take: 2 })
      expect(transactions).toEqual(mockTransactions)
    })
  })

  // TODO: test createTransactionsFromExtrinsics function
})
