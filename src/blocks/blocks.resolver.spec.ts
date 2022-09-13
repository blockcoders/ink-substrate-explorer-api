import { TestingModule, Test } from '@nestjs/testing'
import { mockBlock, mockBlocks } from '../../mocks/blocks-mocks'
import { mockPinoService } from '../../mocks/pino-mocks'
import { mockTransactions } from '../../mocks/transactions-mock'
import { TransactionsModule } from '../transactions/transactions.module'
import { TransactionsService } from '../transactions/transactions.service'
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
        mockPinoService(BlocksResolver.name),
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
        mockPinoService(TransactionsService.name),
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
