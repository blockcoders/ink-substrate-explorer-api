import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Vec } from '@polkadot/types-codec'
import { FrameSystemEventRecord } from '@polkadot/types/lookup'
import { Repository } from 'typeorm'
import { FetchEventsInput } from './dtos/fetch-events.input'
import { Event } from './entity/event.entity'
import { Abi } from '@polkadot/api-contract'
import { DecodedEvent } from '@polkadot/api-contract/types'
import { numberToU8a } from '@polkadot/util'
import { fromString } from 'uuidv4'
import { Contract } from '../contracts/entity/contract.entity'

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Contract)
    private readonly contractRespository: Repository<Contract>,
  ) {}

  async fetchEvents(args: FetchEventsInput): Promise<Event[]> {
    const { skip, take, contract } = args
    return this.eventRepository.find({ skip, take, where: { contract } })
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventRepository.findOneBy({ id })
  }

  async createEventsFromRecords(
    records: Vec<FrameSystemEventRecord>,
    extrinsicIndex: number,
    transactionHash: string,
  ): Promise<Event[]> {
    const events = records.filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(extrinsicIndex))
    const contractEmittedEvents = events.filter((record) => record?.event?.method === 'ContractEmitted')
    const eventsToSave = contractEmittedEvents.map((record) => {
      const {
        event: { section, method, data, index },
        topics,
      } = record
      const [contract] = data
      const compoundId = data[1].toString() + transactionHash.toString()
      return this.eventRepository.create({
        id: fromString(compoundId),
        contract: contract.toString(),
        index: index.toHex(),
        section: section,
        method: method,
        topics: topics.toString(),
        data,
        transactionHash: transactionHash.toString(),
      })
    })
    return Promise.all(eventsToSave.map((event) => this.eventRepository.save(event)))
  }

  async decodeEvents(events: Event[], contractAddress: string) {
    const contract = await this.contractRespository.findOneBy({address: contractAddress})
    if (!contract) throw new Error("Contract not found")
    if (!contract.metadata) throw new Error("Upload the metadata first")
    const buff = Buffer.from(contract.metadata, 'base64').toString('ascii')
    const abi = JSON.parse(buff)
    return events.map(async (event) => this.decodeContractEmittedEvent(abi, event.data))
  }

  decodeContractEmittedEvent(abi: string | Record<string, unknown>, data: any): DecodedEvent {
    const [, event] = data
    return new Abi(abi).decodeEvent(numberToU8a(event))
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
