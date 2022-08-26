import { TestingModule, Test } from '@nestjs/testing'
import { TransactionsModule } from '../transactions/transactions.module'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'
import { Block } from './entity/block.entity'

describe('BlocksResolver', () => {
  let resolver: BlocksResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TransactionsModule],
      providers: [
        BlocksResolver,
        {
          provide: BlocksService,
          useFactory: () => ({
            findOne: jest.fn(() => ({
              hash: '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
              parentHash: '0x9b0f818b9cac7d9451819de6172e308d67c4b8ff8c2f1f6773cdb20c40573858',
              number: '27',
              createdDate: '2022-08-25 22:49:21.843575',
            })),
            fetchBlocks: jest.fn(() => [
              {
                hash: '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
                parentHash: '0x9b0f818b9cac7d9451819de6172e308d67c4b8ff8c2f1f6773cdb20c40573858',
                number: '27',
                createdDate: '2022-08-25 22:49:21.843575',
              },
              {
                hash: '0x106981de7fcfa9ecdce5d7d88bdf912260becea7ac22a142236a1d976eed2a12',
                parentHash: '0x6a573c929bd0bf9ecaf49aaba2fdc72fce82f5451a25485b9678c0e477d8fd8a',
                number: '14',
                createdDate: '2022-08-25 22:49:21.657697',
              },
            ]),
          }),
        },
      ],
    }).compile()

    resolver = module.get<BlocksResolver>(BlocksResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('getBlock', () => {
    it('should get a block by hash', async () => {
      const block = await resolver.getBlock('0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2')
      expect(block).toEqual({
        hash: '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
        parentHash: '0x9b0f818b9cac7d9451819de6172e308d67c4b8ff8c2f1f6773cdb20c40573858',
        number: '27',
        createdDate: '2022-08-25 22:49:21.843575',
      })
    })
  })

  describe('getBlocks', () => {
    it('should get all blocks', async () => {
      const blocks = await resolver.getBlocks({ skip: 0, take: 2 })
      expect(blocks.length).toBe(2)
    })

    it.skip('should obtain all transactions in a block', async () => {
      const transactions = await resolver.getTransactions({
        hash: '0xc8b45f687af1e734eb7b7b84f7bf8a0576f5ca1933626cdae42f2e527a76d7b1',
      } as Block)
      console.log(transactions)
      expect(transactions).toEqual([])
    })
  })
})
