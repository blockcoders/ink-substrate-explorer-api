import { Injectable, OnModuleInit } from '@nestjs/common'
import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Abi } from '@polkadot/api-contract'
import { Header } from '@polkadot/types/interfaces'
import { BlocksService } from '../blocks/blocks.service'
import { EventsService } from '../events/events.service'
import erc20 from '../metadata/erc20'
import { TransactionsService } from '../transactions/transactions.service'
import { CreateTransactionInput } from '../transactions/dtos/create-transaction.input'
import { CreateEventInput } from '../events/dtos/create-event.input'
import { CreateBlockInput } from '../blocks/dtos/create-block.input'
import { DecodedEvent } from '@polkadot/api-contract/types'

@Injectable()
export class SubscriptionsService implements OnModuleInit {
  constructor(
    private readonly blocksService: BlocksService,
    private transactionsService: TransactionsService,
    private readonly eventsService: EventsService,
  ) {}

  async onModuleInit(): Promise<void> {
    console.log(`\n\nSubscribing to new heads...`)
    await this.subscribeAllHeads()
    console.log(`\n\nSubscribing to new events...`)
    await this.subscribeToNewEvents()
  }

  static async connect() {
    const provider = new WsProvider(process.env.WS_PROVIDER)
    return ApiPromise.create({ provider })
  }

  async subscribeAllHeads() {
    const api = await SubscriptionsService.connect()
    await api.rpc.chain.subscribeAllHeads(async (h: Header) => {
      const { block } = await api.rpc.chain.getBlock(h.hash)
      const { header, extrinsics } = block
      extrinsics.forEach(async (ex) => {
        const txInput = CreateTransactionInput.fromExtrinsic(ex, header.hash.toString())
        await this.transactionsService.create(txInput)
      })
      const blockInput = CreateBlockInput.fromHeader(header)
      const b = await this.blocksService.create(blockInput)
      console.log('\n-----------------New block-----------------\n')
      console.log('\nBlock Hash: %j', b.hash)
      console.log('\nTransactions count: %j', extrinsics.length)
      console.log(
        '\nTxs: %j',
        extrinsics.map((ex) => ex.hash),
      )
      console.log('\n-------------------------------------------\n')
    })
  }

  async subscribeToNewEvents() {
    const api = await SubscriptionsService.connect()
    await api.query.system.events((events) => {
      events.forEach(async (record) => {
        const { event } = record
        if (api.events.contracts.ContractEmitted.is(event)) {
          const eventInput = CreateEventInput.fromRecord(record)
          const e = await this.eventsService.create(eventInput)
          const decoded = SubscriptionsService.decode(erc20, event.data)
          const formatted = SubscriptionsService.formatDecoded(decoded)
          console.log('\n-----------------New Event-----------------\n')
          console.log('\nContract: %j', e.contract)
          console.log('\nEvent: %j', decoded.event.identifier)
          console.log('\nSummary: %j', formatted)
          console.log('\n-------------------------------------------\n')
        }
      })
    })
  }

  static decode(abi: string | Record<string, unknown>, data: any) {
    const [, contract_evt] = data
    return new Abi(abi).decodeEvent(contract_evt)
  }

  static formatDecoded(decoded: DecodedEvent) {
    const formatted: any = {}
    for (let i = 0; i < decoded?.event?.args.length; i++) {
      const arg = decoded.event.args[i].name
      const { type } = decoded.event.args[i].type
      formatted[arg] = type === 'Balance' ? parseInt(decoded.args[i].toString()) / 1000000000000 : decoded.args[i]
    }
    return formatted
  }
}
