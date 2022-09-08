import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { mockBlock, mockBlocks } from '../../mocks/blocks-mocks'
import { BlocksService } from './blocks.service'
import { Block } from './entity/block.entity'

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
