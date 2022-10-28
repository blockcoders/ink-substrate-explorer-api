import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import {
  mockContract,
  mockContracts,
  mockContractQueries,
  generateAbiInBase64,
  mockQueryString,
} from '../../mocks/contracts-mocks'
import { mockEvents } from '../../mocks/events-mocks'
import { EventsService } from '../events/events.service'
import { ContractsResolver } from './contracts.resolver'
import { ContractsService } from './contracts.service'
import { Contract } from './entity/contract.entity'

const base64metadata = generateAbiInBase64()

describe('ContractsResolver', () => {
  let resolver: ContractsResolver
  let service: ContractsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsResolver,
        {
          provide: ContractsService,
          useFactory: () => ({
            getContractQueries: jest.fn(() => mockContractQueries),
            fetchContracts: jest.fn(() => mockContracts),
            findOne: jest.fn(() => mockContract),
            uploadMetadata: jest.fn(() => true),
          }),
        },
        {
          provide: EventsService,
          useFactory: () => ({
            fetchEvents: jest.fn(() => mockEvents),
          }),
        },
      ],
    }).compile()

    resolver = module.get<ContractsResolver>(ContractsResolver)
    service = module.get<ContractsService>(ContractsService)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('getContract', () => {
    it('should get a contract by hash', async () => {
      const contract = await resolver.getContract(mockContract.address)
      expect(contract).toEqual(mockContract)
    })
  })

  describe('getContracts', () => {
    it('should get a list of contracts', async () => {
      const args = {
        skip: 0,
        take: 10,
      }
      const contracts = await resolver.getContracts(args)
      expect(contracts).toEqual(mockContracts)
    })
  })

  describe('getContractQueries', () => {
    it('should get contractQueries by address', async () => {
      const contractQueries = await resolver.getContractQueries(mockContract.address)
      expect(contractQueries).toEqual(mockContractQueries)
    })
  })

  describe('uploadMetada', () => {
    it('should update the metada for a contract', async () => {
      const contract = await resolver.uploadMetadata(base64metadata, mockContract.address)
      expect(contract).toBe(true)
    })

    it('should show an error message for invalidad base64 metada', async () => {
      const contract = resolver.uploadMetadata('quwihy4ecf83921pnhyf091p28', mockContract.address)
      expect(contract).rejects.toThrow(Error)
    })

    it('should show an error message for not found contract', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException(`Contract with address: 123 not found`))

      const contract = resolver.uploadMetadata(base64metadata, '123')
      expect(contract).rejects.toThrow(NotFoundException)
    })
  })

  describe('getEvents', () => {
    it('should get events of a contract', async () => {
      const events = await resolver.getEvents({ address: mockContract.address } as Contract)
      expect(events).toBe(mockEvents)
    })
  })

  describe('hasMetadata', () => {
    it('should return true if the contract has metadata', () => {
      expect(resolver.hasMetadata(mockContract as any)).resolves.toBe(true)
    })

    it('should return false if the contract has no metadata', () => {
      const mockNoMetadata = { ...mockContract, metadata: null }
      expect(resolver.hasMetadata(mockNoMetadata as any)).resolves.toBe(false)
    })
  })

  describe('queries', () => {
    it('should return the queries (empty) of the contract', () => {
      expect(resolver.queries(mockContract as any)).resolves.toEqual([])
    })

    it('should return the queries of the contract', () => {
      expect(resolver.queries(mockContractQueries as any)).resolves.toEqual(mockQueryString)
    })
  })
})
