import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlocksService } from './blocks.service'
import { Block } from './entity/block.entity'
import { NotFoundException } from '@nestjs/common'

const mockBlock = {
  hash: '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
  parentHash: '0x9b0f818b9cac7d9451819de6172e308d67c4b8ff8c2f1f6773cdb20c40573858',
  number: 27,
  createdDate: '2022-08-25 22:49:21.843575',
}

const mockBlocks = [
  {
    hash: '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
    parentHash: '0x9b0f818b9cac7d9451819de6172e308d67c4b8ff8c2f1f6773cdb20c40573858',
    number: 27,
    createdDate: '2022-08-25 22:49:21.843575',
  },
  {
    hash: '0x106981de7fcfa9ecdce5d7d88bdf912260becea7ac22a142236a1d976eed2a12',
    parentHash: '0x6a573c929bd0bf9ecaf49aaba2fdc72fce82f5451a25485b9678c0e477d8fd8a',
    number: 14,
    createdDate: '2022-08-25 22:49:21.657697',
  },
]

const mockMissingBlockNumbers = [
  {
    number: 5,
  },
  {
    number: 7,
  },
]

describe('BlocksService', () => {
  let service: BlocksService
  let repo: Repository<Block>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        {
          provide: getRepositoryToken(Block),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockBlock),
            find: jest.fn().mockResolvedValue(mockBlocks),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockBlock),
            query: jest.fn().mockResolvedValue(mockMissingBlockNumbers),
          },
        },
      ],
    }).compile()

    service = module.get<BlocksService>(BlocksService)
    repo = module.get<Repository<Block>>(getRepositoryToken(Block))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    it('should get a single block', () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy')
      expect(service.findOne(mockBlock.hash)).resolves.toEqual(mockBlock)
      expect(repoSpy).toBeCalledWith({ hash: mockBlock.hash })
    })

    it('it should return not found error', () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(null)
      expect(service.findOne('123')).rejects.toThrow(NotFoundException)
      expect(repoSpy).toBeCalledWith({ hash: '123' })
    })
  })

  describe('fetchBlocks', () => {
    it('should get an array of blocks', async () => {
      const blocks = await service.fetchBlocks({ skip: 0, take: 2 })
      expect(blocks).toEqual(mockBlocks)
    })
  })

  describe('getMissingBlocks', () => {
    it('should get an array of missing block numbers', async () => {
      const missingBlocks = await service.getMissingBlocks()
      expect(missingBlocks).toEqual(mockMissingBlockNumbers)
    })
  })

  describe('getLastBlock', () => {
    it('should get the last block in db', async () => {
      const lastBlock = await service.getLastBlock()
      expect(lastBlock).toEqual(mockBlocks[0])
    })
  })

  describe('createFromHeader', () => {
    it('should successfully insert a block', async () => {
      const number = {
        toHex: () => '27',
      }

      expect(
        service.createFromHeader(
          ({
            hash: mockBlock.hash,
            parentHash: mockBlock.parentHash,
            number,
          } as any) || {},
        ),
      ).resolves.toBe(mockBlock)
      expect(repo.create).toBeCalledTimes(1)
      expect(repo.create).toBeCalledWith({
        hash: mockBlock.hash,
        parentHash: mockBlock.parentHash,
        number: mockBlock.number,
      })
      expect(repo.save).toBeCalledTimes(1)
    })
  })
})
