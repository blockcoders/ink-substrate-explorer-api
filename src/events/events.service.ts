import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Abi } from '@polkadot/api-contract'
import { DecodedEvent } from '@polkadot/api-contract/types'
import { Vec } from '@polkadot/types-codec'
import { FrameSystemEventRecord } from '@polkadot/types/lookup'
import { numberToU8a } from '@polkadot/util'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Repository } from 'typeorm'
import { fromString } from 'uuidv4'
import { Contract } from '../contracts/entity/contract.entity'
import { FetchEventsInput } from './dtos/fetch-events.input'
import { Event } from './entity/event.entity'

@Injectable()
export class EventsService {
  constructor(
    @InjectPinoLogger(EventsService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Contract)
    private readonly contractRespository: Repository<Contract>,
  ) {}

  async fetchEvents(args: FetchEventsInput): Promise<Event[]> {
    const { skip, take, contract, transactionHash, orderAsc } = args
    return this.eventRepository.find({
      skip,
      take,
      where: { contract: { address: contract }, transactionHash },
      order: { timestamp: orderAsc ? 'ASC' : 'DESC' },
    })
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventRepository.findOneBy({ id })
  }

  async createEventsFromRecords(
    records: Vec<FrameSystemEventRecord>,
    extrinsicIndex: number,
    transactionHash: string,
    timestamp: number,
  ): Promise<Event[]> {
    const events = records.filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(extrinsicIndex))
    const contractEmittedEvents = events.filter((record) => record?.event?.method === 'ContractEmitted')
    const contractsAddresses = contractEmittedEvents.map((record) => {
      const [address] = record.event.data
      return address.toString()
    })
    const contracts = await Promise.all(
      contractsAddresses.map(async (address) => {
        let contract = (await this.contractRespository.findOne({ where: { address } })) as Contract
        if (!contract) {
          contract = (await this.contractRespository.create({ address }).save()) as Contract
        }
        return contract
      }),
    )

    const eventsToSave = contractEmittedEvents.map((record) => {
      const {
        event: { section, method, data, index },
        topics,
      } = record
      const [contractAddress] = data
      const compoundId = data[1].toString() + transactionHash.toString()
      return this.eventRepository.create({
        id: fromString(compoundId),
        contract: contracts.find((contract: Contract) => contract.address === contractAddress.toString()),
        index: index.toHex(),
        section: section,
        method: method,
        topics: topics.toString(),
        data,
        transactionHash: transactionHash.toString().toLowerCase(),
        timestamp,
      })
    })
    return Promise.all(
      eventsToSave.map(async (e) => {
        let event = (await this.eventRepository.findOne({ where: { id: e.id } })) as Event
        if (!event) {
          event = (await this.eventRepository.save(e)) as Event
        }
        return event
      }),
    )
  }

  async decodeEvents(events: Event[], contractAddress: string) {
    const contract = await this.contractRespository.findOneBy({ address: contractAddress })
    if (!contract) throw new Error('Contract not found')
    if (!contract.metadata) throw new Error('Upload the metadata first')
    return Promise.all(
      events.map(async (event) => {
        try {
          const decodedEvent = this.decodeContractEmittedEvent(contract.metadata as string, event.data)
          event.decodedData = decodedEvent
          event.identifier = decodedEvent?.event?.identifier
          await this.eventRepository.update(event.id, event)
          return {
            identifier: decodedEvent?.event?.identifier,
            decodedData: decodedEvent,
            formattedData: this.formatDecoded(decodedEvent),
          }
        } catch (error) {
          this.logger.error(error)
          return { message: "Can't decode event", error }
        }
      }),
    )
  }

  decodeContractEmittedEvent(abi: string | Record<string, unknown>, data: any): DecodedEvent {
    const [, event] = data
    return new Abi(JSON.parse(abi as string)).decodeEvent(numberToU8a(event))
  }

  formatDecoded(decoded: DecodedEvent) {
    const formatted: any = {}
    for (let i = 0; i < decoded?.event?.args.length; i++) {
      const arg = decoded.event.args[i].name
      const { type } = decoded.event.args[i].type
      formatted[arg] = type === 'Balance' ? parseInt(decoded.args[i].toString()) / 1_000_000_000_000 : decoded.args[i]
    }
    return formatted
  }
}
