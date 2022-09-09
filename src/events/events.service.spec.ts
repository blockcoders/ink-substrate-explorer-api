import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { mockContract } from '../../mocks/contracts-mocks'
import { mockEventHashes, mockEvents } from '../../mocks/events-mocks'
import { ContractsService } from '../contracts/contracts.service'
import { Contract } from '../contracts/entity/contract.entity'
import { Event } from './entity/event.entity'
import { EventsService } from './events.service'

describe('EventsService', () => {
  let service: EventsService
  let repo: Repository<Event>
  let contractRepo: Repository<Contract>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockEvents[0]),
            find: jest.fn().mockResolvedValue(mockEvents),
          },
        },
        ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile()

    service = module.get<EventsService>(EventsService)
    repo = module.get<Repository<Event>>(getRepositoryToken(Event))
    contractRepo = module.get<Repository<Contract>>(getRepositoryToken(Contract))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    it('should get a single event', () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy')
      expect(service.findById(mockEvents[0].id)).resolves.toEqual(mockEvents[0])
      expect(repoSpy).toBeCalledWith({ id: mockEvents[0].id })
    })
  })

  describe('fetchEvents', () => {
    it('should get an array of events', async () => {
      const transactions = await service.fetchEvents({ skip: 0, take: 2 })
      expect(transactions).toEqual(mockEvents)
    })
  })

  describe('decodeEvents', () => {
    it.skip('should return decoded event', () => {
      jest.spyOn(contractRepo, 'findOneBy').mockResolvedValueOnce(mockContract as any)

      expect(service.decodeEvents(mockEvents as any, mockContract.address)).resolves.toHaveLength(2)
    })

    it('should return not found error', () => {
      jest.spyOn(contractRepo, 'findOneBy').mockResolvedValueOnce(null as any)

      expect(service.decodeEvents(mockEvents as any, mockContract.address)).rejects.toThrow(Error)
    })

    it('should return an upload error message', () => {
      jest.spyOn(contractRepo, 'findOneBy').mockResolvedValueOnce({
        address: mockContract.address,
        metadata: '',
      } as any)

      expect(service.decodeEvents(mockEvents as any, mockContract.address)).rejects.toThrow(Error)
    })
  })

  describe('decodeContractEmittedEvent', () => {
    it('should return decoded event', () => {
      expect(service.decodeContractEmittedEvent(mockContract.metadata, mockEventHashes[0])).not.toBeFalsy()
    })
  })

  // TODO: test createEventsFromRecords, formatDecoded
})
