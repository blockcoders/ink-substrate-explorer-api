import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { numberToU8a } from '@polkadot/util'
import { Repository } from 'typeorm'
import { ContractsService } from '../contracts/contracts.service'
import { Contract } from '../contracts/entity/contract.entity'
import { Event } from './entity/event.entity'
import { EventsService } from './events.service'

const mockEvents = [
  {
    id: '09ff3513-d192-5957-b8d8-61ba3aec4fb1',
    contract: '5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t',
    transactionHash: '0x490e16ee0997d50a67c9eea3b885c092bf6483949d5f92f12a0925e92a9baad7',
    index: '0x0703',
    section: 'contracts',
    method: 'ContractEmitted',
    topics:
      '[0x0045726332303a3a5472616e7366657200000000000000000000000000000000, 0x2b00c7d40fe6d84d660f3e6bed90f218e022a0909f7e1a7ea35ada8b6e003564, 0xda2d695d3b5a304e0039e7fc4419c34fa0c1f239189c99bb72a6484f1634782b]',
    data: '["5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t","0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d018eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480010a5d4e80000000000000000000000"]',
    createdDate: '2022-08-25 22:49:21.66883',
  },
  {
    id: '181d7167-f23d-55d7-b403-248f62530fdd',
    contract: '5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t',
    transactionHash: '0xc70b40d973ab3147127efc61e71f532e425e23ebae9dc660146682bb2402b9c5',
    index: '0x0703',
    section: 'contracts',
    method: 'ContractEmitted',
    topics:
      '[0x0045726332303a3a5472616e7366657200000000000000000000000000000000, 0x33766995fd9b44bd45f351b3abd7e5041960638db0075c84ab7af1a734e20d1b, 0xda2d695d3b5a304e0039e7fc4419c34fa0c1f239189c99bb72a6484f1634782b]',
    data: '["5F73xwbK9jtcG1YY38DG5wVLm42y15pCa8zE79snVT5z9X1t","0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d01d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0010a5d4e80000000000000000000000"]',
    createdDate: '2022-08-25 22:49:21.923151',
  },
]

const mockContract = {
  address: '5GRYcveXcsy8Y6jpHc19xE9wm6xSfzKbzZPFKZvGwzBms4hz',
  metadata:
    '{"source":{"hash":"0x3aa1c8ba5f59034a42a93c00ee039a9464d6fa63d70b6889a2596f4528b28a19","language":"ink!3.3.0","compiler":"rustc1.64.0-nightly"},"contract":{"name":"erc20","version":"0.1.0","authors":["[your_name]<[your_email]>"]},"V3":{"spec":{"constructors":[{"args":[{"label":"initial_supply","type":{"displayName":["Balance"],"type":0}}],"docs":["CreatesanewERC-20contractwiththespecifiedinitialsupply."],"label":"new","payable":false,"selector":"0x9bae9d5e"}],"docs":[],"events":[{"args":[{"docs":[],"indexed":true,"label":"from","type":{"displayName":["Option"],"type":11}},{"docs":[],"indexed":true,"label":"to","type":{"displayName":["Option"],"type":11}},{"docs":[],"indexed":false,"label":"value","type":{"displayName":["Balance"],"type":0}}],"docs":["Eventemittedwhenatokentransferoccurs."],"label":"Transfer"},{"args":[{"docs":[],"indexed":true,"label":"owner","type":{"displayName":["AccountId"],"type":2}},{"docs":[],"indexed":true,"label":"spender","type":{"displayName":["AccountId"],"type":2}},{"docs":[],"indexed":false,"label":"value","type":{"displayName":["Balance"],"type":0}}],"docs":["Eventemittedwhenanapprovaloccursthat`spender`isallowedtowithdraw","uptotheamountof`value`tokensfrom`owner`."],"label":"Approval"}],"messages":[{"args":[],"docs":["Returnsthetotaltokensupply."],"label":"total_supply","mutates":false,"payable":false,"returnType":{"displayName":["Balance"],"type":0},"selector":"0xdb6375a8"},{"args":[{"label":"owner","type":{"displayName":["AccountId"],"type":2}}],"docs":["Returnstheaccountbalanceforthespecified`owner`.","","Returns`0`iftheaccountisnon-existent."],"label":"balance_of","mutates":false,"payable":false,"returnType":{"displayName":["Balance"],"type":0},"selector":"0x0f755a56"},{"args":[{"label":"owner","type":{"displayName":["AccountId"],"type":2}},{"label":"spender","type":{"displayName":["AccountId"],"type":2}}],"docs":["Returnstheamountwhich`spender`isstillallowedtowithdrawfrom`owner`.","","Returns`0`ifnoallowancehasbeenset."],"label":"allowance","mutates":false,"payable":false,"returnType":{"displayName":["Balance"],"type":0},"selector":"0x6a00165e"},{"args":[{"label":"to","type":{"displayName":["AccountId"],"type":2}},{"label":"value","type":{"displayName":["Balance"],"type":0}}],"docs":["Transfers`value`amountoftokensfromthecaller\'saccounttoaccount`to`.","","Onsuccessa`Transfer`eventisemitted.","","#Errors","","Returns`InsufficientBalance`erroriftherearenotenoughtokenson","thecaller\'saccountbalance."],"label":"transfer","mutates":true,"payable":false,"returnType":{"displayName":["Result"],"type":8},"selector":"0x84a15da1"},{"args":[{"label":"spender","type":{"displayName":["AccountId"],"type":2}},{"label":"value","type":{"displayName":["Balance"],"type":0}}],"docs":["Allows`spender`towithdrawfromthecaller\'saccountmultipletimes,upto","the`value`amount.","","Ifthisfunctioniscalledagainitoverwritesthecurrentallowancewith`value`.","","An`Approval`eventisemitted."],"label":"approve","mutates":true,"payable":false,"returnType":{"displayName":["Result"],"type":8},"selector":"0x681266a0"},{"args":[{"label":"from","type":{"displayName":["AccountId"],"type":2}},{"label":"to","type":{"displayName":["AccountId"],"type":2}},{"label":"value","type":{"displayName":["Balance"],"type":0}}],"docs":["Transfers`value`tokensonthebehalfof`from`totheaccount`to`.","","Thiscanbeusedtoallowacontracttotransfertokensononesbehalfand/or","tochargefeesinsub-currencies,forexample.","","Onsuccessa`Transfer`eventisemitted.","","#Errors","","Returns`InsufficientAllowance`erroriftherearenotenoughtokensallowed","forthecallertowithdrawfrom`from`.","","Returns`InsufficientBalance`erroriftherearenotenoughtokenson","theaccountbalanceof`from`."],"label":"transfer_from","mutates":true,"payable":false,"returnType":{"displayName":["Result"],"type":8},"selector":"0x0b396f18"}]},"storage":{"struct":{"fields":[{"layout":{"cell":{"key":"0x0000000000000000000000000000000000000000000000000000000000000000","ty":0}},"name":"total_supply"},{"layout":{"cell":{"key":"0x0100000000000000000000000000000000000000000000000000000000000000","ty":1}},"name":"balances"},{"layout":{"cell":{"key":"0x0200000000000000000000000000000000000000000000000000000000000000","ty":6}},"name":"allowances"}]}},"types":[{"id":0,"type":{"def":{"primitive":"u128"}}},{"id":1,"type":{"def":{"composite":{"fields":[{"name":"offset_key","type":5,"typeName":"Key"}]}},"params":[{"name":"K","type":2},{"name":"V","type":0}],"path":["ink_storage","lazy","mapping","Mapping"]}},{"id":2,"type":{"def":{"composite":{"fields":[{"type":3,"typeName":"[u8;32]"}]}},"path":["ink_env","types","AccountId"]}},{"id":3,"type":{"def":{"array":{"len":32,"type":4}}}},{"id":4,"type":{"def":{"primitive":"u8"}}},{"id":5,"type":{"def":{"composite":{"fields":[{"type":3,"typeName":"[u8;32]"}]}},"path":["ink_primitives","Key"]}},{"id":6,"type":{"def":{"composite":{"fields":[{"name":"offset_key","type":5,"typeName":"Key"}]}},"params":[{"name":"K","type":7},{"name":"V","type":0}],"path":["ink_storage","lazy","mapping","Mapping"]}},{"id":7,"type":{"def":{"tuple":[2,2]}}},{"id":8,"type":{"def":{"variant":{"variants":[{"fields":[{"type":9}],"index":0,"name":"Ok"},{"fields":[{"type":10}],"index":1,"name":"Err"}]}},"params":[{"name":"T","type":9},{"name":"E","type":10}],"path":["Result"]}},{"id":9,"type":{"def":{"tuple":[]}}},{"id":10,"type":{"def":{"variant":{"variants":[{"index":0,"name":"InsufficientBalance"},{"index":1,"name":"InsufficientAllowance"}]}},"path":["erc20","erc20","Error"]}},{"id":11,"type":{"def":{"variant":{"variants":[{"index":0,"name":"None"},{"fields":[{"type":2}],"index":1,"name":"Some"}]}},"params":[{"name":"T","type":2}],"path":["Option"]}}]}}',
}

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
      const events = [
        numberToU8a(
          '0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0190b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe2200203d88792d00000000000000000000' as any,
        ),
        numberToU8a(
          '0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d01be5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f00602f46021400000000000000000000' as any,
        ),
      ]
      jest.spyOn(contractRepo, 'findOneBy').mockResolvedValueOnce(mockContract as any)

      expect(service.decodeEvents(events as any, mockContract.address)).resolves.toHaveLength(2)
    })

    it('should return not found error', () => {
      const events = [
        numberToU8a(
          '0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0190b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe2200203d88792d00000000000000000000' as any,
        ),
        numberToU8a(
          '0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d01be5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f00602f46021400000000000000000000' as any,
        ),
      ]

      jest.spyOn(contractRepo, 'findOneBy').mockResolvedValueOnce(null as any)

      expect(service.decodeEvents(events as any, mockContract.address)).rejects.toThrow(Error)
    })

    it('should return an upload error message', () => {
      const events = [
        numberToU8a(
          '0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0190b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe2200203d88792d00000000000000000000' as any,
        ),
        numberToU8a(
          '0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d01be5ddb1579b72e84524fc29e78609e3caf42e85aa118ebfe0b0ad404b5bdd25f00602f46021400000000000000000000' as any,
        ),
      ]

      jest.spyOn(contractRepo, 'findOneBy').mockResolvedValueOnce({
        address: mockContract.address,
        metadata: '',
      } as any)

      expect(service.decodeEvents(events as any, mockContract.address)).rejects.toThrow(Error)
    })
  })

  describe('decodeContractEmittedEvent', () => {
    it('should return decoded event', () => {
      const data =
        '0x0001d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0190b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe2200203d88792d00000000000000000000'

      expect(service.decodeContractEmittedEvent(mockContract.metadata, numberToU8a(data as any))).not.toBeFalsy()
    })
  })

  // TODO: test createEventsFromRecords, decodeEvents, formatDecoded
})
