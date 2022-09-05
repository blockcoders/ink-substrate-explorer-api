# **Ink! Explorer**

## **About the explorer**

Ink Explorer is an application that provides Ink contracts related information on Substrate based blockchains. It subscribes to blockchain and Ink modules events and store the information on its own PostgreSQL database. The backend exposes an API that can interact with the DB and run fast queries to get specific information in a short time. 

The idea of this project is to have fast way to start a node that can be used as an explorer getting live and old data for specific contracts or addresses. 

This project serves useful information that is not available anywhere else. Since the back end is in charge of obtaining information related to the balances, transactions and more, of the contracts that use Ink modules. Ink Explorer uses polkadot.js to communicate with the Substrate / Polkadot networks. It is safe to say that this project is a must. 

Blockcoders is a team that is always contributing to blockchain projects to help the growth of the ecosystem.

## **About us**

### Team members

- Jose Ramirez
- Damián Fixel
- Fernando Sirni

### Contact

- **Contact Name:** Jose Ramirez
- **Contact Email:** jose@blockcoders.io
- **Website:** http://blockcoders.io/

### Team's experience

Our team has been contributing with different projects in blockchain for a few years, building APIs, SDKs and developer tools. Our goal is to continue to drive the crypto space forward by investing intellectual capital into projects, participating actively to help shape the ecosystems we believe in.

### Team Code Repos

- https://github.com/blockcoders
- https://github.com/blockcoders/nestjs-ethers
- https://github.com/blockcoders/harmony-marketplace-sdk
- https://github.com/blockcoders/near-rpc-providers
- https://github.com/athenafarm/athena-vault-contracts
- https://github.com/athenafarm/athena-sdk

Please also provide the GitHub accounts of all team members. If they contain no activity, references to projects hosted elsewhere or live are also fine.

- https://github.com/0xslipk
- https://github.com/fersirni
- https://github.com/damianfixel

### Team LinkedIn Profiles (if available)

- https://www.linkedin.com/in/jarcodallo/
- https://www.linkedin.com/in/fernando-sirni-1931ba122/
- https://www.linkedin.com/in/dami%C3%A1n-fixel-6a3928163/

## **Get Started**

## Running the serivce locally 

### Environment setup

 - Install [Node.js](https://nodejs.org/)
   - Recommended method is by using [NVM](https://github.com/creationix/nvm)
   - Recommendeded Node.js version is v16.13
 - Install [Docker](https://docs.docker.com/get-docker/)

### Install all the dependencies

```
pnpm i --frozen-lockfile
```

### Configure the environment variables

**Note**: The .env file has the configuration for GraphQL, the PostgreSQL database, Node and the RPC url of the Substrate Blockchain.
```
cp .env.sample .env
```
### Start a Postgres DB using docker (optional)

To start the project a **PostgreSQL DB** is needed. For that, the **dev-docker-compose.yaml** file already has an image set up ready to use.
Running this command it will also start a container for pgAdmin:
```
docker-compose up -f dev-docker-compose.yaml -d
```

### Start a local Substrate Node (optional)

The service needs to connect to a Substrate Blockchain. To run a local node use [this paritytech guide](https://github.com/paritytech/substrate-contracts-node).

**Note**: Change the WS_PROVIDER var in the **.env** file to be `ws://127.0.0.1:9944`

### Starting the project (DEV)

* ### `pnpm start:dev`

Runs the service in the development mode.
The service will reload if you make edits.

**Note**: A postgresDB up and running is required.


### Starting the project (PROD)

To start both the Back-end service container and the DB container run:
* ### `docker-compose up -d`

### Test

Running the unit tests.
* ### `pnpm test`

Running the test coverage.
* ### `pnpm test:cov`


## Running the Back-end service Docker image

### Download the image from DockerHub

```
docker pull {dockerImage}
```

### Run

* ### `docker run -it -p 5000:5000 --network ink-explorer-network --env-file {pathToEnvFile} {dockerImage}`

Verify the image started running
```
docker ps
```
The result should look like this:
```
CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS         PORTS                                       NAMES
3a83e1efddf9   ink-explorer   "docker-entrypoint.s…"   20 hours ago   Up 8 seconds   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   ink-explorer-api_1
```

After the server started, the blocks should be being saved on the DB.

## **API**

With the service up and running an API is provided by using GraphQL queries.

### **Queries**

<span style="color:#385499"> **Status**: Retrieves the status of the application</span>

```graphql
query {
  status
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "status": "running"
  }
}
```
<span style="color:#385499"> **getBlock**: Retrieves the block by hash </span>

```graphql
query {
  getBlock(hash: "0x05815b7f1706f46d101b6073ebfa6d47ae9089b5ce5db9deb80382198689466a") {
    hash
    number
    parentHash
    transactions {
    	hash
    }
  }
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getBlock": {
      "hash": "0x05815b7f1706f46d101b6073ebfa6d47ae9089b5ce5db9deb80382198689466a",
      "number": 934059,
      "parentHash": "0x31c5025aa86e3af7d77991c8ad3442b01be768399d22af004d9ea5fa771e3827",
      "transactions": [
        {
          "hash": "0x9bb5a80b80305b4b1acc93214e3a703e2c3c879b3fae91bfc809ad91753195da"
        },
        {
          "hash": "0xc49a19fe985222ca0b9b2f8b2f83c65e00efd57552ac245a4c362f882b999040"
        }
      ]
    }
  }
}
```

<span style="color:#385499"> **getBlocks**: Retrieves blocks (use skip and take to paginate) </span>

```graphql
query {
  getBlocks(skip: 0, take: 10) {
    hash
    number
    parentHash
    transactions {
    	hash
    }
  }
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getBlocks": [
      {
        "hash": "0xec403717319c75ad80f6c5a43446dac41a44c2ddf086eedad622d8d784f90d46",
        "number": 934057,
        "parentHash": "0x0b3e49c138c74f0afc9034a325a25c90433990e0dfdf6f6c9697c591f7c8e7b3",
        "transactions": [
          {
            "hash": "0x20be54758f8645bfd1b1f38d798271471edef3deadee1d7a4cd74e628120292a"
          },
          {
            "hash": "0xf9e94bd8286080340a48dd105eb5d4ab7bbf7aa92869b5537c2b3c5fa8c58ba5"
          }
        ]
      },
    ...]
  }
}
```

<span style="color:#385499"> **getTransaction**: Retrieves a single transaction by hash </span>

```graphql
query {
  getTransaction(hash: "0xfaed625a9948f88aac7b1ff353492cd5834108cfecb1ede82d7bc2f763fcbd28") {
    hash
    blockHash
    method
    nonce
    section
    signature
    signer
    tip
  }
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getTransaction": {
      "hash": "0xfaed625a9948f88aac7b1ff353492cd5834108cfecb1ede82d7bc2f763fcbd28",
      "blockHash": "0xe138e4b9db53b1a552c26d3f4c3e7573d369512bfb402632d48d6c90521c9922",
      "method": "setValidationData",
      "nonce": 0,
      "section": "parachainSystem",
      "signature": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "signer": "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM",
      "tip": 0
    }
  }
}
```

<span style="color:#385499"> **getTransactions**: Retrieves transactions by block hash (use skip and take to paginate)</span>

```graphql
query {
  getTransactions(blockHash: "0xa7ef8085bfad2354e5191e012bd412c0d76c213f43a68187194b7696a0822b93") {
    hash
    blockHash
    method
    nonce
    section
    signature
    signer
    tip
  }
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getTransactions": [
      {
        "hash": "0xf715221f0e46c5a666e65e99af70631cc32a46cf6121ed3be56768ff303eda36",
        "blockHash": "0xa7ef8085bfad2354e5191e012bd412c0d76c213f43a68187194b7696a0822b93",
        "method": "setValidationData",
        "nonce": 0,
        "section": "parachainSystem",
        "signature": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "signer": "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM",
        "tip": 0,
        "events": []
      },
      ...
    ]
  }
}
```

<span style="color:#385499"> **getEvents**: Retrieves events by contract address or transaction hash (use skip and take to paginate)</span>

```graphql
query {
	getEvents(contract: "5F7FvAUyB6ok4Sj3j82x315F3pDCZSiGovxWcnjadnpSMi7t") {
    id
    index
    method
    section
    topics
    transactionHash
    data
  }  
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql

```

<span style="color:#385499"> **decodeEvents**: Decodes the events data for a specefic contract. Requires that the contract's metadata was already uploaded using the mutation **uploadMetadata**</span>

```graphql
query {
	decodeEvents(contractAddress: "5F7FvAUyB6ok4Sj3j82x315F3pDCZSiGovxWcnjadnpSMi7t")
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql

```
<span style="color:#385499"> **getContract**: Retrieves a contract by address</span>

```graphql
query {
	getContract(address: "5F7FvAUyB6ok4Sj3j82x315F3pDCZSiGovxWcnjadnpSMi7t") {
    address
    metadata
  }
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql

```

### **Mutations**

<span style="color:#385499"> **uploadMetadata**: To decode events it is necessary to upload the contract's ABI. Passing a base64 string ABI to this mutation will save that to DB. After that run a **decodeEvents** query to see the decoded data on the events.</span>

```graphql
query {
	getContract(address: "5F7FvAUyB6ok4Sj3j82x315F3pDCZSiGovxWcnjadnpSMi7t") {
    address
    metadata
  }
}
```
<span style="color:#5EBA7D"> Response: </span>

```graphql

```

### **About decoding events**

To see the decoded data of the events there is one requirement, the contract metadata needs to uploaded at least once.

Example of an ERC20 contract metadata:

```json
{
  "source": {
    "hash": "0x3aa1c8ba5f59034a42a93c00ee039a9464d6fa63d70b6889a2596f4528b28a19",
    "language": "ink! 3.3.0",
    "compiler": "rustc 1.64.0-nightly"
  },
  "contract": {
    "name": "erc20",
    "version": "0.1.0",
    "authors": [
      "[your_name] <[your_email]>"
    ]
  },
  "V3": {
    "spec": {
      "constructors": [
        {
          "args": [
            {
              "label": "initial_supply",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 0
              }
            }
          ],
          "docs": [
            "Creates a new ERC-20 contract with the specified initial supply."
          ],
          "label": "new",
          "payable": false,
          "selector": "0x9bae9d5e"
        }
      ],
      "docs": [],
      "events": [
        {
          "args": [
            {
              "docs": [],
              "indexed": true,
              "label": "from",
              "type": {
                "displayName": [
                  "Option"
                ],
                "type": 11
              }
            },
            {
              "docs": [],
              "indexed": true,
              "label": "to",
              "type": {
                "displayName": [
                  "Option"
                ],
                "type": 11
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "value",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 0
              }
            }
          ],
          "docs": [
            " Event emitted when a token transfer occurs."
          ],
          "label": "Transfer"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": true,
              "label": "owner",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 2
              }
            },
            {
              "docs": [],
              "indexed": true,
              "label": "spender",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 2
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "value",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 0
              }
            }
          ],
          "docs": [
            " Event emitted when an approval occurs that `spender` is allowed to withdraw",
            " up to the amount of `value` tokens from `owner`."
          ],
          "label": "Approval"
        }
      ],
      ...
```

Once it is uploaded the events can be decoded using the *decodeEvents* query that can be found on section **Queries**.

**Note**: The metadata should be uploaded as a **base64** string.

For more on uploading the metadata go to the **Mutations** section a search for *uploadMetadata*.