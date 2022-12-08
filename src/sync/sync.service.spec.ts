import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { finishedSyncMock, syncingSyncMock } from '../../mocks/sync-mock'
import { EnvModule } from '../env/env.module'
import { Sync } from './entity/sync.entity'
import { SyncService } from './sync.service'

describe('SyncService', () => {
  let service: SyncService
  let repo: MongoRepository<Sync>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvModule],
      providers: [
        SyncService,
        {
          provide: getRepositoryToken(Sync),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(finishedSyncMock),
            findOneAndUpdate: jest.fn().mockResolvedValue(syncingSyncMock),
            create: jest.fn().mockResolvedValue({
              save: jest.fn().mockResolvedValue(syncingSyncMock),
            }),
          },
        },
      ],
    }).compile()

    service = module.get<SyncService>(SyncService)
    repo = module.get<MongoRepository<Sync>>(getRepositoryToken(Sync))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('find', () => {
    it('should return synd data', () => {
      expect(service.find()).resolves.toEqual(finishedSyncMock)
    })
  })

  describe('updateSync', () => {
    it('should update sync data', async () => {
      const newBlock = { lastSynced: 200, status: 'syncing', timestamp: '123' }

      const repoSpy = jest.spyOn(repo, 'findOneAndUpdate')

      await service.updateSync(newBlock)

      expect(repoSpy).toHaveBeenCalled()
    })
  })

  describe('finishSync', () => {
    it('should update sync status to "synced"', async () => {
      const repoSpy = jest.spyOn(repo, 'findOneAndUpdate')

      await service.finishSync()
      expect(repoSpy).toHaveBeenCalled()
    })
  })

  describe('createSync', () => {
    it('should create sync data with id 1', () => {
      expect(service.createSync()).resolves.toEqual(syncingSyncMock)
    })
  })
})
