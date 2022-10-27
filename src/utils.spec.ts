import { ApiPromise } from '@polkadot/api'
import { apiMock } from '../mocks/api-mock'
import { connect } from './utils'
jest.mock('@polkadot/api')
describe('Utils', () => {
  let api: ApiPromise

  beforeEach(async () => {
    const MockedApi = ApiPromise as jest.MockedClass<typeof ApiPromise>
    MockedApi.create = jest.fn().mockResolvedValue(apiMock)
    api = await MockedApi.create()
  })

  it('should return an ApiPromise instance', async () => {
    const result = await connect('ws://localhost:9944')
    expect(result).toEqual(api)
  })
})
