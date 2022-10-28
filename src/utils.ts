import { ApiPromise, WsProvider } from '@polkadot/api'

export const connect = async (provider: string | string[] | undefined) => {
  return ApiPromise.create({ provider: new WsProvider(provider) })
}
