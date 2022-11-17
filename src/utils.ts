import { ApiPromise, WsProvider } from '@polkadot/api'
import { PinoLogger } from 'nestjs-pino'

export const connect = async (endpoint: string, logger: PinoLogger | Console = console) => {
  const provider = new WsProvider(endpoint, false)

  logger.info(`Connecting to ${endpoint}...`)

  await provider.connect()

  provider.on('connected', () => {
    logger.info(`Connected to ${endpoint}`)
  })

  provider.on('disconnected', async () => {
    logger.warn(`Disconnected to ${endpoint}, retying...`)

    await provider.connect()
  })

  provider.on('error', async (err) => {
    logger.error({ err }, `Error connecting to ${endpoint}`)
  })

  return ApiPromise.create({ provider })
}
