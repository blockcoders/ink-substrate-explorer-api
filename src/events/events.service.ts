import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Bytes, Vec } from '@polkadot/types-codec'
import { FrameSystemEventRecord } from '@polkadot/types/lookup'
import { Repository } from 'typeorm'
import { FetchEventsInput } from './dtos/fetch-events.input'
import { Event } from './entity/event.entity'
import { Abi } from '@polkadot/api-contract'
import { DecodedEvent } from '@polkadot/api-contract/types'
import erc20 from '../metadata/erc20'

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
      const abi = erc20
      const dataString = this.decode(abi, method, record)
      return this.eventRepository.create({
        id: data[1].toString() || '',
        contract: contract.toString(),
        index: index.toHex(),
        section: section,
        method: method,
        topics: topics.toString(),
        data: dataString,
        jsonData: data,
        transactionHash: transactionHash.toString(),
      })
    })
    return Promise.all(eventsToSave.map((event) => this.eventRepository.save(event)))
  }

  decode(abi: string | Record<string, unknown>, method: string, record: FrameSystemEventRecord) {
    const [, event] = record.event.data
    let stringData: any = {
      raw: record.event.data,
    }
    if (abi && method === 'ContractEmitted') {
      const decoded = new Abi(abi).decodeEvent(event as Uint8Array | Bytes)
      stringData = { ...stringData, decoded, formatted: this.formatDecoded(decoded) }
    }
    return JSON.stringify(stringData)
  }

  formatDecoded(decoded: DecodedEvent) {
    const formatted: any = {}
    for (let i = 0; i < decoded?.event?.args.length; i++) {
      const arg = decoded.event.args[i].name
      const { type } = decoded.event.args[i].type
      formatted[arg] = type === 'Balance' ? parseInt(decoded.args[i].toString()) / 1000000000000 : decoded.args[i]
    }
    return formatted
  }
}
