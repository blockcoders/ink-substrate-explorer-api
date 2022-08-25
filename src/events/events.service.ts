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

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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
      return this.eventRepository.create({
        id: data[1].toString() || '',
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
