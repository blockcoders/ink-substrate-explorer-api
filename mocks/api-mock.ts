import { mockExtrinsics } from './transactions-mock'

export const apiMock = {
  rpc: {
    chain: {
      getBlockHash: (blockNumber: number) => {
        return blockNumber === 27
          ? Promise.resolve('0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2')
          : Promise.resolve('0x106981de7fcfa9ecdce5d7d88bdf912260becea7ac22a142236a1d976eed2a12')
      },
      getBlock: (hash: string) => {
        return hash === '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2'
          ? Promise.resolve({
              block: {
                header: {
                  hash: '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2',
                  parentHash: '0x9b0f818b9cac7d9451819de6172e308d67c4b8ff8c2f1f6773cdb20c40573858',
                  number: {
                    toHex: () => '27',
                  },
                },
                extrinsics: mockExtrinsics,
              },
            })
          : Promise.resolve({
              block: {
                header: {
                  hash: '0x106981de7fcfa9ecdce5d7d88bdf912260becea7ac22a142236a1d976eed2a12',
                  parentHash: '0x6a573c929bd0bf9ecaf49aaba2fdc72fce82f5451a25485b9678c0e477d8fd8a',
                  number: {
                    toHex: () => '14',
                  },
                },
                extrinsics: mockExtrinsics,
              },
            })
      },
    },
  },
  query: {
    system: {
      events: {
        at: (hash: string) => {
          return hash === '0x03b26a67c6c7fda467f7b96d09b99d04ef9a8163043e72b5e5474358631afad2'
            ? Promise.resolve([])
            : Promise.resolve([])
        },
      },
    },
  },
}
