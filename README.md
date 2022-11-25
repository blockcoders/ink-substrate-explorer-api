Ink! Explorer API
=================

[![App Build](https://img.shields.io/github/workflow/status/blockcoders/ink-substrate-explorer-api/Pulll%20Request%20App%20Build/main?logo=github)](https://github.com/blockcoders/ink-substrate-explorer-api/actions/workflows/pr.yaml)
[![Coverage Status](https://coveralls.io/repos/github/blockcoders/ink-substrate-explorer-api/badge.svg?branch=main)](https://coveralls.io/github/blockcoders/ink-substrate-explorer-api?branch=main)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fe5ba084394c4730b35948e2a39ad1c7)](https://www.codacy.com/gh/blockcoders/ink-substrate-explorer-api/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=blockcoders/ink-substrate-explorer-api&amp;utm_campaign=Badge_Grade)
[![BCH compliance](https://bettercodehub.com/edge/badge/blockcoders/ink-substrate-explorer-api?branch=main)](https://bettercodehub.com/)
[![Docker Image Version](https://img.shields.io/docker/v/blockcoders/ink-substrate-explorer-api?logo=docker&logoColor=white)](https://hub.docker.com/repository/docker/blockcoders/ink-substrate-explorer-api/general)
[![Docker Image Size](https://img.shields.io/docker/image-size/blockcoders/ink-substrate-explorer-api?logo=docker&logoColor=white)](https://hub.docker.com/repository/docker/blockcoders/ink-substrate-explorer-api/general)
[![License](https://img.shields.io/badge/license-MIT%20License-brightgreen.svg)](https://opensource.org/licenses/MIT)

## Demo

[ink-explorer-api.blockcoders.io](https://ink-explorer-api.blockcoders.io/graphql)

## **About the explorer**

Ink Explorer is an application that provides Ink contracts related information on Substrate based blockchains. It subscribes to blockchain and Ink modules events and store the information on its own PostgreSQL database. The backend exposes an API that can interact with the DB and run fast queries to get specific information in a short time.

The idea of this project is to provide a tool that allows developers of Ink! explore and analyze the contracts found on the blockchain. This tool can be used to analyze the contracts found on Substrate based blockchains that are using Ink! modules. It can also be used to analyze contracts that are on a local blockchain.

This project serves useful information that is not available anywhere else. Since the back end is in charge of obtaining information related to the balances, transactions and more, of the contracts that use Ink modules. Ink Explorer uses polkadot.js to communicate with the Substrate / Polkadot networks. It is safe to say that this project is a must.

## **Get Started**

## Running the service locally

### Environment setup

- Install [Node.js](https://nodejs.org/)
  - Recommended method is by using [NVM](https://github.com/creationix/nvm)
  - Recommendeded Node.js version is v16.13
- Install [Docker](https://docs.docker.com/get-docker/)

### Install all the dependencies

```sh
pnpm i --frozen-lockfile
```

### Configure the environment variables

**Note**: The .env file has the configuration for GraphQL, the PostgreSQL database, Node and the RPC url of the Substrate Blockchain.

```sh
cp .env.sample .env
```

#### Service configurations

```sh
NODE_ENV=development
PORT=8080
LOG_NAME=ink-substrate-explorer-api
LOG_LEVEL=debug
```

#### GraphQL configurations

```sh
GRAPHQL_DEBUG=true
GRAPHQL_PLAYGROUND=true
GRAPHQL_SORT_SCHEMA=true
GRAPHQL_INTROSPECTION=true
```

#### Database configurations

```sh
DATABASE_HOST=postgres
DATABASE_NAME=ink
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_RETRY_ATTEMPTS=5
DATABASE_RETRY_DELAY=3000
```

#### Blockchain and Sync configurations

```sh
WS_PROVIDER=wss://rococo-contracts-rpc.polkadot.io
# Set to true to process every block from FIRST_BLOCK_TO_LOAD to the current block. Set to false to only start processing blocks from the last existing block in the database.
LOAD_ALL_BLOCKS=false
# Block number from which the service will start to process blocks. (Can be genesis or some other block. For example, the first block supporting contracts)
FIRST_BLOCK_TO_LOAD=0
# Number of blocks to process concurrently. This can speed up or down the syncing process.
BLOCK_CONCURRENCY=1000
```

## **Starting the project (DEV)**

### Start a Postgres DB using docker (optional)

To start the project a **PostgreSQL DB** is needed. For that, the **dev-docker-compose.yaml** file already has an image set up ready to use.
Running this command it will also start a container for pgAdmin:

```sh
docker-compose -f dev-docker-compose.yaml up -d
```

Once the service is running, pgAdmin can be accessed following the link that is shown in the terminal (In this case localhost:80).

![pgAdmin](/.images/pg_admin_up.png)

The credentials to access pgAdmin are (set in the dev-docker-compose file):

- PGADMIN_DEFAULT_EMAIL: "admin@admin.com"
- PGADMIN_DEFAULT_PASSWORD: "admin"

Register a new server in pgAdmin and set the credentials for the PostgreSQL DB:

Right click on 'Servers' and select "Register" -> "Server"

![pgAdmin](/.images/pg_admin_select_server.png)

Set a name for the server (In this example "Docker")

![pgAdmin](/.images/pg_admin_server_name.png)

Set the credentials for the PostgreSQL DB (this can be found in the dev-docker-compose file):

![pgAdmin](/.images/pg_admin_connection.png)

### Start a local Substrate Node (optional)

The service needs to connect to a Substrate Blockchain. For that, the **dev-docker-compose.yaml** file already has an image set up ready to use.
Run this command:

```sh
docker-compose -f dev-docker-compose.yaml up -d
```

Another way to run a local node is with [this paritytech guide](https://github.com/paritytech/substrate-contracts-node).

**Note**: Change the WS_PROVIDER var in the **.env** file to be `ws://127.0.0.1:9944`

### Start the service

```sh
pnpm start:dev
```

Runs the service in the development mode.
The service will reload if you make edits.

**Note**: A postgresDB up and running and a valid connection to a substrate node are required.

## **Starting the project (PROD)**

To start the backend service, DB and pgAdmin containers run the following command:

```sh
docker-compose up -d
```

**Note**: A postgresDB up and running and a valid connection to a substrate node are required.
Optionally comment the backend service in the docker-compose file if you want to run the image locally.

## Running the Back-end service Docker image

### Download the image from DockerHub

```sh
docker pull blockcoders/ink-substrate-explorer-api:latest
```

### Run

```sh
# Create a docker network
docker network create ink-explorer-network

# Run the service
docker run -it -p 5000:5000 --network ink-explorer-network --env-file {pathToEnvFile} blockcoders/ink-substrate-explorer-api:latest
```

#### Verify the image started running

```sh
docker ps
```

The result should look like this:

```sh
CONTAINER ID   IMAGE                                    COMMAND                  CREATED          STATUS          PORTS                                       NAMES
f31a7d0fd6c8   blockcoders/ink-substrate-explorer-api   "docker-entrypoint.s…"   15 seconds ago   Up 14 seconds   0.0.0.0:5000->5000/tcp, :::5000->5000/tcp   funny_lumiere
```

The service will connect to the DB container and start processing blocks.

## **Testing**

Running the unit tests.

```sh
pnpm test
```

Running the test coverage.

```sh
pnpm test:cov
```

Testing the GraphQL queries.

```sh
{"level":30,"time":1664298430389,"pid":1388770,"hostname":"username","name":"ink-substrate-explorer-api","msg":"App listening on http://0.0.0.0:5000"}
```

Once the back-end service is running, the GraphQL Playground can be accessed at http://localhost:5000/graphql

![backend](/.images/graphql_example.png)

## **API definition**

With the service up and running an API is provided by using GraphQL queries.

### **Queries**

<span style="color:#2a98db"> **Status**: Retrieves the status of the application</span>

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

<span style="color:#2a98db"> **Version**: Retrieves the version of the application</span>

```graphql
query {
  status
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "version": "v1.0.5"
  }
}
```

<span style="color:#2a98db"> **getBlock**: Retrieves the block by hash </span>

```graphql
query {
  getBlock(hash: "0x0f615cf7edf8a1e8591893a594fe0ef67d5d56c4d9b1a89d8d120c5f821127fe") {
    hash
    number
    parentHash
    timestamp
    encodedLength
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
      "hash": "0x0f615cf7edf8a1e8591893a594fe0ef67d5d56c4d9b1a89d8d120c5f821127fe",
      "number": 7,
      "parentHash": "0xd8ecc752f280a3786c5cdd4d441d71488414fd6132ace481dd6ddb23fd8000b0",
      "timestamp": 1666888006111,
      "encodedLength": 312,
      "transactions": [
        {
          "hash": "0xdb561ee4432e07a959292acf9895ce379e2474a52160b93fd62496806fdf26cd"
        },
        {
          "hash": "0x33831da6b804e82cd7613e0d780823c7455c773546ea5e76c945ed10a6f6554b"
        }
      ]
    }
  }
}
```

<span style="color:#2a98db"> **getBlocks**: Retrieves blocks. Use 'skip' and 'take' to paginate. Use 'orderByNumber: false' to order by timestamp instead and 'orderAsc: true' to see older blocks first.</span>

```graphql
query {
  getBlocks(skip: 0, take: 1, orderByNumber: false, orderAsc: false) {
    hash
    number
    parentHash
    timestamp
    encodedLength
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
        "hash": "0x0f615cf7edf8a1e8591893a594fe0ef67d5d56c4d9b1a89d8d120c5f821127fe",
        "number": 7,
        "parentHash": "0xd8ecc752f280a3786c5cdd4d441d71488414fd6132ace481dd6ddb23fd8000b0",
        "timestamp": 1666888006111,
        "encodedLength": 312,
        "transactions": [
          {
            "hash": "0xdb561ee4432e07a959292acf9895ce379e2474a52160b93fd62496806fdf26cd"
          },
          {
            "hash": "0x33831da6b804e82cd7613e0d780823c7455c773546ea5e76c945ed10a6f6554b"
          }
        ]
      }
    ]
  }
}
```

<span style="color:#2a98db"> **getTransaction**: Retrieves a single transaction by hash </span>

```graphql
query {
  getTransaction(hash: "0x33831da6b804e82cd7613e0d780823c7455c773546ea5e76c945ed10a6f6554b") {
    args
    blockHash
    callIndex
    decimals
    encodedLength
    era
    events {
      method
    }
    hash
    method
    nonce
    section
    signature
    signer
    ss58
    timestamp
    tip
    tokens
    type
    version
  }
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getTransaction": {
      "args": "{\"dest\":{\"id\":\"5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8\"},\"value\":0,\"gas_limit\":75000000000,\"storage_deposit_limit\":null,\"data\":\"0x84a15da18eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48005039278c0400000000000000000000\"}",
      "blockHash": "0x0f615cf7edf8a1e8591893a594fe0ef67d5d56c4d9b1a89d8d120c5f821127fe",
      "callIndex": "7,0",
      "decimals": "12",
      "encodedLength": 201,
      "era": "{\"mortalEra\":\"0x0b00\"}",
      "events": [
        {
          "method": "ContractEmitted"
        }
      ],
      "hash": "0x33831da6b804e82cd7613e0d780823c7455c773546ea5e76c945ed10a6f6554b",
      "method": "call",
      "nonce": 3,
      "section": "contracts",
      "signature": "0x78582786706e947a6d77ac5b49ba140b4c88ebc644421136bbfa8b66577e1e3efdbc1d981948546fff41600be9a716e4c38a8531a867853f26ba11ee21128f82",
      "signer": "5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc",
      "ss58": "42",
      "timestamp": 1666888006111,
      "tip": 0,
      "tokens": "Unit",
      "type": 4,
      "version": 132
    }
  }
}
```

<span style="color:#2a98db"> **getTransactionsByContract**: Retrieves a list of transactions of a contract.</span>

```graphql
query {
  getTransactionsByContract(
    address: "5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8"
    skip: 0
    take: 1
    orderAsc: false
  ) {
    args
    blockHash
    callIndex
    decimals
    encodedLength
    era
    events {
      method
    }
    hash
    method
    nonce
    section
    signature
    signer
    ss58
    timestamp
    tip
    tokens
    type
    version
  }
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getTransactionsByContract": [
      {
        "args": "{\"dest\":{\"id\":\"5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8\"},\"value\":0,\"gas_limit\":75000000000,\"storage_deposit_limit\":null,\"data\":\"0x84a15da18eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48005039278c0400000000000000000000\"}",
        "blockHash": "0x0f615cf7edf8a1e8591893a594fe0ef67d5d56c4d9b1a89d8d120c5f821127fe",
        "callIndex": "7,0",
        "decimals": "12",
        "encodedLength": 201,
        "era": "{\"mortalEra\":\"0x0b00\"}",
        "events": [
          {
            "method": "ContractEmitted"
          }
        ],
        "hash": "0x33831da6b804e82cd7613e0d780823c7455c773546ea5e76c945ed10a6f6554b",
        "method": "call",
        "nonce": 3,
        "section": "contracts",
        "signature": "0x78582786706e947a6d77ac5b49ba140b4c88ebc644421136bbfa8b66577e1e3efdbc1d981948546fff41600be9a716e4c38a8531a867853f26ba11ee21128f82",
        "signer": "5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc",
        "ss58": "42",
        "timestamp": 1666888006111,
        "tip": 0,
        "tokens": "Unit",
        "type": 4,
        "version": 132
      }
    ]
  }
}
```

<span style="color:#2a98db"> **getTransactions**: Retrieves transactions by block hash (use 'skip' and 'take' to paginate. use 'orderAsc' to see older or newer first)</span>

```graphql
query {
  getTransactions(skip: 0, take: 1, orderAsc: false) {
    args
    blockHash
    callIndex
    decimals
    encodedLength
    era
    events {
      method
    }
    hash
    method
    nonce
    section
    signature
    signer
    ss58
    timestamp
    tip
    tokens
    type
    version
  }
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getTransactions": [
      {
        "args": "{\"now\":1666888006111}",
        "blockHash": "0x0f615cf7edf8a1e8591893a594fe0ef67d5d56c4d9b1a89d8d120c5f821127fe",
        "callIndex": "2,0",
        "decimals": "12",
        "encodedLength": 11,
        "era": "{\"immortalEra\":\"0x00\"}",
        "events": [],
        "hash": "0xdb561ee4432e07a959292acf9895ce379e2474a52160b93fd62496806fdf26cd",
        "method": "set",
        "nonce": 0,
        "section": "timestamp",
        "signature": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "signer": "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM",
        "ss58": "42",
        "timestamp": 1666888006111,
        "tip": 0,
        "tokens": "Unit",
        "type": 4,
        "version": 4
      }
    ]
  }
}
```

<span style="color:#2a98db"> **getEvent**: Retrieves an event by id</span>

```graphql
query {
  getEvent(id: "81735cc9-76d3-5984-83af-5872bc9eaeb7") {
    id
    index
    method
    section
    timestamp
    topics
    transactionHash
    data
    decodedData
    formattedData
  }
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getEvent": {
      "id": "81735cc9-76d3-5984-83af-5872bc9eaeb7",
      "index": "0x0703",
      "method": "ContractEmitted",
      "section": "contracts",
      "timestamp": 1666888006111,
      "topics": "[0x0045726332303a3a5472616e7366657200000000000000000000000000000000, 0x08be862c40d599dc6f4f28076712bb324c0cd2197c30f07459887b41fadff2c8, 0x2b00c7d40fe6d84d660f3e6bed90f218e022a0909f7e1a7ea35ada8b6e003564]",
      "transactionHash": "0x33831da6b804e82cd7613e0d780823c7455c773546ea5e76c945ed10a6f6554b",
      "data": "[\"5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8\",\"0x0001c40e2006bbebf9022c317f9337ad376e56d392917e5ac1397fe09b07c765c050018eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48005039278c0400000000000000000000\"]",
      "decodedData": "{\"args\":[\"5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc\",\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"0x00000000000000000000048c27395000\"],\"event\":{\"args\":[{\"name\":\"from\",\"type\":{\"sub\":{\"docs\":[],\"info\":10,\"type\":\"AccountId\",\"namespace\":\"ink_env::types::AccountId\",\"lookupIndex\":2,\"lookupNameRoot\":\"InkEnvAccountId\"},\"docs\":[],\"info\":9,\"type\":\"Option<AccountId>\",\"namespace\":\"Option\",\"lookupIndex\":11}},{\"name\":\"to\",\"type\":{\"sub\":{\"docs\":[],\"info\":10,\"type\":\"AccountId\",\"namespace\":\"ink_env::types::AccountId\",\"lookupIndex\":2,\"lookupNameRoot\":\"InkEnvAccountId\"},\"docs\":[],\"info\":9,\"type\":\"Option<AccountId>\",\"namespace\":\"Option\",\"lookupIndex\":11}},{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}],\"docs\":[\" Event emitted when a token transfer occurs.\"],\"index\":0,\"identifier\":\"Transfer\"}}",
      "formattedData": "{\"from\":\"5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc\",\"to\":\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"value\":5}"
    }
  }
}
```

<span style="color:#2a98db"> **getEvents**: Retrieves events by contract address or transaction hash (use 'skip' and 'take' to paginate, 'orderAsc' to see older or newer first)</span>

```graphql
query {
  getEvents(contract: "5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8", skip: 0, take: 1, orderAsc: false) {
    id
    index
    method
    section
    timestamp
    topics
    transactionHash
    data
    decodedData
    formattedData
  }
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getEvents": [
      {
        "id": "81735cc9-76d3-5984-83af-5872bc9eaeb7",
        "index": "0x0703",
        "method": "ContractEmitted",
        "section": "contracts",
        "timestamp": 1666888006111,
        "topics": "[0x0045726332303a3a5472616e7366657200000000000000000000000000000000, 0x08be862c40d599dc6f4f28076712bb324c0cd2197c30f07459887b41fadff2c8, 0x2b00c7d40fe6d84d660f3e6bed90f218e022a0909f7e1a7ea35ada8b6e003564]",
        "transactionHash": "0x33831da6b804e82cd7613e0d780823c7455c773546ea5e76c945ed10a6f6554b",
        "data": "[\"5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8\",\"0x0001c40e2006bbebf9022c317f9337ad376e56d392917e5ac1397fe09b07c765c050018eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48005039278c0400000000000000000000\"]",
        "decodedData": "{\"args\":[\"5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc\",\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"0x00000000000000000000048c27395000\"],\"event\":{\"args\":[{\"name\":\"from\",\"type\":{\"sub\":{\"docs\":[],\"info\":10,\"type\":\"AccountId\",\"namespace\":\"ink_env::types::AccountId\",\"lookupIndex\":2,\"lookupNameRoot\":\"InkEnvAccountId\"},\"docs\":[],\"info\":9,\"type\":\"Option<AccountId>\",\"namespace\":\"Option\",\"lookupIndex\":11}},{\"name\":\"to\",\"type\":{\"sub\":{\"docs\":[],\"info\":10,\"type\":\"AccountId\",\"namespace\":\"ink_env::types::AccountId\",\"lookupIndex\":2,\"lookupNameRoot\":\"InkEnvAccountId\"},\"docs\":[],\"info\":9,\"type\":\"Option<AccountId>\",\"namespace\":\"Option\",\"lookupIndex\":11}},{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}],\"docs\":[\" Event emitted when a token transfer occurs.\"],\"index\":0,\"identifier\":\"Transfer\"}}",
        "formattedData": "{\"from\":\"5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc\",\"to\":\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"value\":5}"
      }
    ]
  }
}
```

<span style="color:#2a98db"> **getContract**: Retrieves a contract by address</span>

```graphql
query {
  getContract(address: "5G24svh2w4QXNhsHU5XBxf8N3Sw2MPu7sAemofv1bCuyxAzc") {
    address
    metadata
    hasMetadata
  }
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getContract": {
      "address": "5G24svh2w4QXNhsHU5XBxf8N3Sw2MPu7sAemofv1bCuyxAzc",
      "metadata": "{\n  \"source\": {\n    \"hash\": ...   }\n}\n",
      "hasMetadata": true
    }
  }
}
```

<span style="color:#2a98db"> **getContracts**: Retrieves a list of contracts</span>

```graphql
query {
  getContracts(skip: 0, take: 10) {
    address
    metadata
    hasMetadata
    events {
      method
    }
  }
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getContracts": [
      {
        "address": "5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8",
        "hasMetadata": true,
        "metadata": "{ ... }",
        "events": [
          {
            "method": "ContractEmitted"
          },
        ]
      }
    ]
  }
}
```

<span style="color:#2a98db"> **getContractQueries**: Retrieves a contract. If this contract has uploaded metadata it will also retrieve the queries and transaction methods that can be executed.</span>

```graphql
query {
  getContractQueries(address: "5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8") {
    address
    hasMetadata
    queries {
      args
      docs
      method
      name
    }
  }
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "getContractQueries": {
      "address": "5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8",
      "hasMetadata": true,
      "queries": [
        {
          "args": [],
          "docs": [
            " Returns the total token supply."
          ],
          "method": "totalSupply",
          "name": "Total supply"
        },
        {
          "args": [
            "{\"name\":\"to\",\"type\":{\"info\":10,\"type\":\"AccountId\"}}",
            "{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}"
          ],
          "docs": [
            " Transfers `value` amount of tokens from the caller's account to account `to`.",
            "",
            " On success a `Transfer` event is emitted.",
            "",
            " # Errors",
            "",
            " Returns `InsufficientBalance` error if there are not enough tokens on",
            " the caller's account balance."
          ],
          "method": "transfer",
          "name": "Transfer"
        }
      ]
    }
  }
}
```

### **Mutations**

<span style="color:#2a98db"> **decodeEvent**: Decodes the event data for a specific event. Requires that the contract's metadata was already uploaded using the mutation **uploadMetadata**</span>

```graphql
mutation {
  decodeEvent(
    contractAddress: "5ELpkDtq7werhT5ybZZMbVBcQTPNomvJP7j5kJQifv7GzVik"
    id: "972e782c-2517-5648-9bf1-4c693d2fed90"
  )
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "decodeEvent": "{\"identifier\":\"Transfer\",\"decodedData\":{\"args\":[\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y\",\"0x000000000000000000002d79883d2000\"],\"event\":{\"args\":[{\"name\":\"from\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"to\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}],\"docs\":[\" Event emitted when a token transfer occurs.\"],\"identifier\":\"Transfer\",\"index\":0}},\"formattedData\":{\"from\":\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"to\":\"5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y\",\"value\":50}}"
  }
}
```

<span style="color:#2a98db"> **decodeEvents**: Decodes the events data for a specific contract (use 'skip' and 'take' to select the events and 'orderAsc' to order by timestamp). Requires that the contract's metadata was already uploaded using the mutation **uploadMetadata**</span>

```graphql
mutation {
  decodeEvents(contract: "5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8", skip: 0, take: 1, orderAsc: false)
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "decodeEvents": "[{\"identifier\":\"Transfer\",\"decodedData\":{\"args\":[\"5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc\",\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"0x00000000000000000000048c27395000\"],\"event\":{\"args\":[{\"name\":\"from\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"to\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}],\"docs\":[\" Event emitted when a token transfer occurs.\"],\"identifier\":\"Transfer\",\"index\":0}},\"formattedData\":{\"from\":\"5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc\",\"to\":\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"value\":5}}]"
  }
}
```

<span style="color:#2a98db"> **uploadMetadata**: To decode events it is necessary to upload the contract's ABI. Passing a base64 string ABI to this mutation will save that to DB. After that run a **decodeEvents** query to see the decoded data on the events.</span>

```graphql
mutation Upload {
  uploadMetadata(
    contractAddress: "5G24svh2w4QXNhsHU5XBxf8N3Sw2MPu7sAemofv1bCuyxAzc"
    metadata: "ewogICJzb3VyY2UiOiB7CiAgICAiaGFzaCI6I...(base64)"
  )
}
```

<span style="color:#5EBA7D"> Response: </span>

```graphql
{
  "data": {
    "uploadMetadata": true
  }
}
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

Once it is uploaded the events can be decoded using the _decodeEvent_ or _decodeEvents_ mutation that can be found on section **Mutations**.

**Note**: The metadata should be uploaded as a **base64** string.

For more on uploading the metadata go to the **Mutations** section a search for _uploadMetadata_.

## **Subscriptions**

The first time the node is started, it may need to start from the block 0 and load all blocks (LOAD_ALL_BLOCKS env var should be set to true). If you want to start from a specific block, you can use the FIRST_BLOCK_TO_LOAD env var to start from another block.

In case of a downtime of the node, the subscriptions will be reconnected automatically recovering all new blocks from the last block that was processed.

**Note**: Load all blocks may take a long time depending on the number of blocks that need to be loaded. It is recommended to use a node with a fast internet connection. The node will be able to process all blocks in a few hours.

### Some benchmarks

#### Using BLOCK_CONCURRENCY = 100

- 100 blocks ~ 6 seconds
- 1000 blocks ~ 30.5 seconds
- 10000 blocks ~ 4:24 minutes
- 100000 blocks ~ 39.57 minutes

#### Using BLOCK_CONCURRENCY = 1000

- 100 blocks ~ 0.5 seconds
- 1000 blocks ~ 5 seconds
- 10000 blocks ~ 3 minutes
- 100000 blocks ~ 24 minutes

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Collaborators

- [**Jose Ramirez**](https://github.com/0xslipk)
- [**Fernando Sirni**](https://github.com/fersirni)
- [**Ruben Gutierrez**](https://github.com/RubenGutierrezC)

## License

Licensed under the Apache 2.0 - see the [LICENSE](LICENSE) file for details.
