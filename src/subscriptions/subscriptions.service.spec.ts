import { Test, TestingModule } from '@nestjs/testing'
import { ApiPromise } from '@polkadot/api'
import { apiMock } from '../../mocks/api-mock'
import { mockBlock, mockBlocks } from '../../mocks/blocks-mocks'
import { mockEvents } from '../../mocks/events-mocks'
import { mockPinoService } from '../../mocks/pino-mocks'
import { mockExtrinsics, mockTransactions } from '../../mocks/transactions-mock'
import { BlocksService } from '../blocks/blocks.service'
import { EventsService } from '../events/events.service'
import { TransactionsService } from '../transactions/transactions.service'
import { SubscriptionsService } from './subscriptions.service'
jest.mock('@polkadot/api')

describe('subscriptionsService', () => {
  let service: SubscriptionsService
  let api: ApiPromise
  let blockService: BlocksService

  beforeAll(async () => {
    const MockedApi = ApiPromise as jest.MockedClass<typeof ApiPromise>
    MockedApi.create = jest.fn().mockResolvedValue(apiMock)
    api = await MockedApi.create()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: BlocksService,
          useValue: {
            createFromHeader: jest.fn().mockResolvedValue(mockBlock),
            getLastBlock: jest.fn().mockResolvedValue(mockBlock),
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            createTransactionsFromExtrinsics: jest.fn().mockResolvedValue(mockTransactions),
          },
        },
        {
          provide: EventsService,
          useValue: {
            createEventsFromRecords: jest.fn().mockResolvedValue(mockEvents),
          },
        },
        mockPinoService(SubscriptionsService.name),
      ],
    }).compile()

    service = module.get<SubscriptionsService>(SubscriptionsService)
    blockService = module.get<BlocksService>(BlocksService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('onModuleInit', () => {
    it('should show an error message', () => {
      try {
        jest.spyOn(service, 'syncBlocks').mockImplementation(() => {
          throw new Error('grcp error')
        })

        service.onModuleInit()
        fail("Shouldn't reach this point")
      } catch (error) {
        console.log(error)
        expect((error as Error).message).toBe('grcp error')
      }
    })
  })

  describe('syncBlocks', () => {
    it('should load all blocks', async () => {
      jest.spyOn(SubscriptionsService, 'connect').mockImplementation(() => Promise.resolve(api))
      jest.spyOn(blockService, 'getLastBlock').mockResolvedValue({ ...mockBlock, number: 20 } as any)
      jest.spyOn(service, 'subscribeNewHeads').mockImplementation(() => Promise.resolve([]) as any)
      jest
        .spyOn(service, 'processBlock')
        .mockResolvedValueOnce(mockBlocks[0].hash)
        .mockResolvedValueOnce(mockBlocks[1].hash)

      const result = await service.syncBlocks()

      expect(result).toEqual([mockBlocks[0].hash, mockBlocks[1].hash])

      expect(blockService.getLastBlock).toBeCalledTimes(1)
    })

    it('should show already sync message', async () => {
      jest.spyOn(SubscriptionsService, 'connect').mockImplementation(() => Promise.resolve(api))
      jest.spyOn(blockService, 'getLastBlock').mockResolvedValue({ ...mockBlock, number: 100 } as any)
      jest.spyOn(service, 'subscribeNewHeads').mockImplementation(() => Promise.resolve([]) as any)

      const result = await service.syncBlocks()

      expect(result).toBe(undefined)
      expect(blockService.getLastBlock).toBeCalledTimes(1)
    })
  })

  describe('registerBlockData', () => {
    it('should return the registered block', async () => {
      const number = {
        toHex: () => '27',
      }

      const header = {
        hash: mockBlock.hash,
        parentHash: mockBlock.parentHash,
        number,
      }
      const result = await service.registerBlockData({ header, extrinsics: mockExtrinsics, records: [] })
      expect(result).toEqual(mockBlock)
    })
  })

  describe('getBlockData', () => {
    it('should return header, extrinics, records from a block hash', async () => {
      const result = await service.getBlockData(api, mockBlock.hash as any)

      expect(JSON.stringify(result)).toBe(
        JSON.stringify({
          header: {
            hash: '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
            parentHash: '0x9b0f818b9cac7d9451819de6172e308d67c4b8ff8c2f1f6773cdb20c40573858',
            number: {
              toHex: () => '27',
            },
          },
          extrinsics: mockExtrinsics,
          records: [],
        }),
      )
    })
  })

  describe('getBlocksToLoad', () => {
    it('should return an array of number from 0 to 5', () => {
      const result = service.getBlocksToLoad(0, 5)
      expect(result).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('processBlock', () => {
    it('should return the block hash', async () => {
      const number = 27
      const result = await service.processBlock(api, number)
      expect(result).toEqual(mockBlock.hash)
    })

    it('should return an error message', async () => {
      try {
        jest.spyOn(service, 'getBlockData').mockResolvedValue(Promise.reject("Can't connect to database"))

        const number = 27
        const result = await service.processBlock(api, number)
        expect(result).rejects.toBe("Can't connect to database")
        fail("Shouldn't reach this point")
      } catch (error) {
        expect(error).toEqual("Can't connect to database")
      }
    })
  })
})
