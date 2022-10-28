import abi from './erc20'

export const generateAbiInBase64 = () => {
  const buff = new Buffer(JSON.stringify(abi))
  const base64data = buff.toString('base64')
  return base64data
}

export const mockContract = {
  address: '5GRYcveXcsy8Y6jpHc19xE9wm6xSfzKbzZPFKZvGwzBms4hz',
  metadata: JSON.stringify(abi),
}

export const mockContracts = [mockContract]

export const mockContractQueries = {
  ...mockContract,
  queries: [{ args: [{ fake: 'arg' }] }],
}

export const mockQueryString = [{ args: ['{"fake":"arg"}'] }]
