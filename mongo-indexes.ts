import 'dotenv/config'
import mongoose from 'mongoose'

const host = process.env.DATABASE_HOST
const port = process.env.DATABASE_PORT
const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const database = process.env.DATABASE_NAME

export async function main() {
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

  console.log('all indexes added')
}

// main()
//   .catch((err) => console.log(err))
//   .then(() => {
//     console.log('all index added')
//     process.exit()
//   })
