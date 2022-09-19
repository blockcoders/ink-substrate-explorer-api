import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { mockContract, generateAbiInBase64 } from '../../mocks/contracts-mocks'
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
})
