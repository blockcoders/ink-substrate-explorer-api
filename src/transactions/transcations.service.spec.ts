import { Test, TestingModule } from '@nestjs/testing'
import { EventsModule } from '../events/events.module'
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
            findOne: () => ({
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
            }),
            fetchTransactions: () => [{}, {}],
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
      const transcation = await resolver.getTransaction(
        '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
      )
      expect(transcation).toEqual({
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
      })
    })
  })

  describe('getTransactions', () => {
    it('should get all blocks', async () => {
      const transactions = await resolver.getTransactions({
        blockHash: '0x5721a1e39a8097a6aa312be44baa46d869075d1bd94cf45410d99b113cc68af5',
        skip: 0,
        take: 20,
      })
      console.log(transactions)
      // expect(transactions.length).toBe(2)
    })

    // it.skip('should obtain all transactions in a block', async () => {
    //   const transactions = await resolver.getTransactions({
    //     hash: '0xc8b45f687af1e734eb7b7b84f7bf8a0576f5ca1933626cdae42f2e527a76d7b1',
    //   } as Block)
    //   console.log(transactions)
    //   expect(transactions).toEqual([])
    // })
  })
})
