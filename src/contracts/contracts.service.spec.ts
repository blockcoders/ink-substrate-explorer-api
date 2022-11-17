import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ApiPromise } from '@polkadot/api'
import { Repository } from 'typeorm'
import { apiMock } from '../../mocks/api-mock'
import { BASE64_METADATA } from '../../mocks/base64-metadata.mock'
import { mockContractQueries } from '../../mocks/contracts-mocks'
import { mockPinoService } from '../../mocks/pino-mocks'
import { EnvModule } from '../env/env.module'
import { connect } from '../utils'
import { ContractsService } from './contracts.service'
import { Contract } from './entity/contract.entity'

jest.mock('../utils')

const mockContracts = [
  {
    address: '5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t',
    metada: '',
    createdDate: '2022-08-25 22:49:21.66883',
  },
]

describe('ContractService', () => {
  let service: ContractsService
  let repo: Repository<Contract>
  let api: ApiPromise

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvModule],
      providers: [
        ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: {
            find: jest.fn().mockResolvedValue(mockContracts),
            findOne: jest.fn().mockResolvedValue(mockContracts[0]),
            findOneBy: jest.fn().mockResolvedValue(mockContracts[0]),
            save: jest.fn().mockResolvedValue(true),
          },
        },
        mockPinoService(ContractsService.name),
      ],
    }).compile()

    service = module.get<ContractsService>(ContractsService)
    repo = module.get<Repository<Contract>>(getRepositoryToken(Contract))

    const MockedApi = ApiPromise as jest.MockedClass<typeof ApiPromise>
    MockedApi.create = jest.fn().mockResolvedValue(apiMock)
    api = await MockedApi.create()

    const mockedConnect = connect as jest.MockedFunction<typeof connect>
    mockedConnect.mockResolvedValue(api)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    it('should get a single contract', () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy')
      expect(service.findOne(mockContracts[0].address)).resolves.toEqual(mockContracts[0])
      expect(repoSpy).toBeCalledWith({ address: mockContracts[0].address })
    })

    it('it should return not found error', () => {
      const repoSpy = jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(null)
      expect(service.findOne('123')).rejects.toThrow(NotFoundException)
      expect(repoSpy).toBeCalledWith({ address: '123' })
    })
  })

  describe('fetchContracts', () => {
    it('should get a list of contracts', () => {
      const repoSpy = jest.spyOn(repo, 'find')
      expect(service.fetchContracts({ skip: 0, take: 5 })).resolves.toEqual(mockContracts)
      expect(repoSpy).toBeCalledWith({ skip: 0, take: 5 })
    })

    it('it should return empty list for skip to high', () => {
      const repoSpy = jest.spyOn(repo, 'find').mockResolvedValueOnce([])
      expect(service.fetchContracts({ skip: 10000, take: 5 })).resolves.toEqual([])
      expect(repoSpy).toBeCalledWith({ skip: 10000, take: 5 })
    })
  })

  describe('uploadMetadata', () => {
    it('should update the metada for a contract', () => {
      expect(service.uploadMetadata(mockContracts[0] as any, BASE64_METADATA)).resolves.toEqual(true)
      expect(repo.save).toBeCalledTimes(1)
    })

    it('it should an error message by try-catch', () => {
      jest.spyOn(repo, 'save').mockImplementation(() => {
        throw new Error('')
      })
      expect(service.uploadMetadata(mockContracts[0] as any, '1234')).resolves.toEqual(false)
    })
  })

  describe('getContractQueries', () => {
    it.skip('should get a contract with queries', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne').mockResolvedValueOnce(mockContractQueries as unknown as Contract)
      const contract = await service.getContractQueries(mockContractQueries.address)
      expect(contract.address).toEqual(mockContractQueries.address)
      expect(contract.metadata).toEqual(mockContractQueries.metadata)
      expect(contract.queries).toEqual(mockContractQueries.queries)
      expect(repoSpy).toBeCalledWith(mockContractQueries.address)
    })
  })
})
