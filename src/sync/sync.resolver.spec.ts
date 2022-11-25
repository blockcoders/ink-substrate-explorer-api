import { Test, TestingModule } from '@nestjs/testing'
import { finishedSyncMock } from '../../mocks/sync-mock'
import { SyncResolver } from './sync.resolver'
import { SyncService } from './sync.service'

describe('SyncResolver', () => {
  let resolver: SyncResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncResolver,
        {
          provide: SyncService,
          useFactory: () => ({
            find: jest.fn().mockResolvedValue(finishedSyncMock),
          }),
        },
      ],
    }).compile()

    resolver = module.get<SyncResolver>(SyncResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('getSync', () => {
    it('should return sync data', async () => {
      const sync = await resolver.getSync()
      expect(sync).toEqual(finishedSyncMock)
    })
  })
})
