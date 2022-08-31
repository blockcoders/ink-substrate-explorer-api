import { TestingModule, Test } from '@nestjs/testing'
import { TransactionsModule } from '../transactions/transactions.module'
import { TransactionsService } from '../transactions/transactions.service'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'
import { Block } from './entity/block.entity'

const mockBlock = {
  hash: '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
  parentHash: '0x9b0f818b9cac7d9451819de6172e308d67c4b8ff8c2f1f6773cdb20c40573858',
  number: '27',
  createdDate: '2022-08-25 22:49:21.843575',
}

const mockBlocks = [
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
]

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
            findOne: jest.fn(() => mockBlock),
            fetchBlocks: jest.fn(() => mockBlocks),
          }),
        },
        {
          provide: TransactionsService,
          useFactory: () => ({
            fetchTransactions: jest.fn(() => mockTransactions),
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
      const block = await resolver.getBlock(mockBlock.hash)
      expect(block).toEqual(mockBlock)
    })
  })

  describe('getBlocks', () => {
    it('should get all blocks', async () => {
      const blocks = await resolver.getBlocks({ skip: 0, take: 10 })
      expect(blocks).toEqual(mockBlocks)
    })
  })

  describe('getTransactions', () => {
    it('should get all transactions of a block', async () => {
      const transactions = await resolver.getTransactions({ hash: mockBlock.hash } as Block)
      expect(transactions).toBe(mockTransactions)
    })
  })
})
