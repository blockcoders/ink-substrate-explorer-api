import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlocksService } from './blocks.service'
import { Block } from './entity/block.entity'
import { stringToU8a, compactFromU8a } from '@polkadot/util'

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
  })

  describe('fetchBlocks', () => {
    it('should get an array of blocks', async () => {
      const blocks = await service.fetchBlocks({ skip: 0, take: 2 })
      expect(blocks).toEqual(mockBlocks)
    })
  })

  // describe('createFromHeader', () => {
  //   it('should successfully insert a block', async () => {
  //     const number = compactFromU8a(stringToU8a(mockBlock.number))

  //     console.log(number)

  //     expect(
  //       service.createFromHeader({
  //         hash: mockBlock.hash,
  //         parentHash: mockBlock.parentHash,
  //         number,
  //       } as any),
  //     ).resolves.toBe(mockBlock)
  //     expect(repo.create).toBeCalledTimes(1)
  //     expect(repo.create).toBeCalledWith({
  //       hash: mockBlock.hash,
  //       parentHash: mockBlock.parentHash,
  //       number: mockBlock.number,
  //     })
  //     expect(repo.save).toBeCalledTimes(1)
  //   })
  // })
})
