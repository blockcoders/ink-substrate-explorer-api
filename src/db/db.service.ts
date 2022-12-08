import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EnvService } from '../env/env.service'

@Injectable()
export class DbService {
  constructor(
    @InjectPinoLogger(DbService.name)
    private readonly logger: PinoLogger,
    private readonly env: EnvService,
  ) {}

  async addIndexes() {
    const host = this.env.DATABASE_HOST
    const port = this.env.DATABASE_PORT
    const username = this.env.DATABASE_USERNAME
    const password = this.env.DATABASE_PASSWORD
    const database = this.env.DATABASE_NAME

    const con = await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`)

    // block indexes
    const blocks = con.connection.collection('blocks')
    await blocks.createIndex({ timestamp: -1 })
    await blocks.createIndex({ timestamp: 1 })

    await blocks.createIndex({ number: -1 })
    await blocks.createIndex({ number: 1 })

    // transactions indexes
    const transactions = con.connection.collection('transactions')
    await transactions.createIndex({ timestamp: -1 })
    await transactions.createIndex({ timestamp: 1 })
    await transactions.createIndex({ blockHash: -1 })
    await transactions.createIndex({ blockHash: 1 })

    // events indexes
    const events = con.connection.collection('events')
    await events.createIndex({ timestamp: -1 })
    await events.createIndex({ timestamp: 1 })
    await events.createIndex({ contract: -1 })
    await events.createIndex({ contract: 1 })
    await events.createIndex({ transactionHash: -1 })
    await events.createIndex({ transactionHash: 1 })

    this.logger.debug('indexes')
  }
}
