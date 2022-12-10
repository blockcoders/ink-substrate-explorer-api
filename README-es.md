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

## **Acerca del explorador**

Ink Explorer es una aplicacion que provee informacion relativa a los contratos que utilizan Ink! en blockchains basadas en Substrate. Se suscribe a la blockchain y a los eventos emitidos por los modulos de Ink! y guarda la informacion en su propia base de datos. El back-end expone una API que puede interactuar con la base de datos y ejecutar consultas rapidas para obtener informacion especifica en poco tiempo.

La idea de este proyecto es brindar una herramienta que permita a los desarrolladores de Ink! explorar y analizar los contratos que se encuentran en blockchain. Esta herramienta se puede utilizar para analizar los contratos que se encuentran en blockchains basadas en Substrate que utilizan módulos Ink!. También se puede usar para analizar contratos que están en una blockchain local.

Este proyecto ofrece información útil que no está disponible en ningún otro lugar. Ya que el back end se encarga de obtener información relacionada con los saldos, transacciones y más, de los contratos que utilizan módulos Ink!. El explorador utiliza polkadot.js para comunicarse con las redes Substrate/Polkadot. Es seguro decir que este proyecto es imprescindible.

## **Introduccion**

## Levantando el servicio localmente

### Configuracion del entorno

- Instalar [Node.js](https://nodejs.org/)
  - El metodo recomentado es utilizando [NVM](https://github.com/creationix/nvm)
  - La verision de Node.js recomendada es v16.13
- Instalar [Docker](https://docs.docker.com/get-docker/)

### Instalar todas las dependencias

```sh
pnpm i --frozen-lockfile
```

### Configurar las variables de entorno

**Nota**: El archivo .env tiene la configuracion para GraphQL, la base de datos Mongo, Node y la url del RPC de la blockchain basada en Substrate.

```sh
cp .env.sample .env
```

#### Configuraciones del servicio

```sh
NODE_ENV=development
PORT=8080
LOG_NAME=ink-substrate-explorer-api
LOG_LEVEL=debug
```

#### Configuraciones de GraphQL

```sh
GRAPHQL_DEBUG=true
GRAPHQL_PLAYGROUND=true
GRAPHQL_SORT_SCHEMA=true
GRAPHQL_INTROSPECTION=true
```

#### Configuraciones de la base de datos

```sh
DATABASE_HOST=mongo
DATABASE_NAME=ink
DATABASE_USERNAME=mongodb
DATABASE_PASSWORD=mongodb
DATABASE_RETRY_ATTEMPTS=5
DATABASE_RETRY_DELAY=3000
```

#### Configuraciones de la blockchain y la sincronizacion de datos

```sh
WS_PROVIDER=wss://rococo-contracts-rpc.polkadot.io
# Asignar el valor _true_ para procesar cada bloque desde FIRST_BLOCK_TO_LOAD hasta el ultimo bloque de la cadena. Asignar el valor _false_ para solo comenzar a procesar los bloques desde el ultimo bloque existente en la base de datos.
LOAD_ALL_BLOCKS=false
# Número de bloque a partir del cual el servicio comenzará a procesar bloques. (Puede ser génesis o algún otro bloque. Por ejemplo, el primer bloque admite contratos)
FIRST_BLOCK_TO_LOAD=0
# Número de bloques a procesar simultáneamente. Esto puede acelerar o retrasar el proceso de sincronización.
BLOCK_CONCURRENCY=1000
```

## **Levantando el servicio (DEV)**

### Instanciar una BD Mongo utilizando docker (opcional)

Para levantar el servicio es necesario contar con una **BD Mongo**. Para esto, el archivo **dev-docker-compose.yaml** ya tiene una imagen configurada lista para usar.
Ejecutando el siguiente comando tambien instanciara un contenedor para Mongo Express:

```sh
docker-compose -f dev-docker-compose.yaml up -d
```

Una vez que el servicio se está ejecutando, se puede acceder a Mongo Express siguiendo el enlace que se muestra en la terminal (en este caso localhost:8081).

### Instanciar un nodo local de Substrate (opcional)

El servicio necesita conectarse a una blockchain basada en Substrate. Para esto, el archivo **dev-docker-compose.yaml** ya tiene una imagen configurada lista para usar.
Ejecute este comando:

```sh
docker-compose -f dev-docker-compose.yaml up -d
```

Otra forma de ejecutar un nodo local es con [esta guía de paritytech](https://github.com/paritytech/substrate-contracts-node).

**Nota**: Cambie la variable WS_PROVIDER en el archivo **.env** para que sea `ws://127.0.0.1:9944`

### Levantando el servicio

```sh
pnpm start:dev
```

Ejecuta el servicio en el modo de desarrollo.
El servicio se recargará si realiza ediciones.

**Nota**: Se requiere una base de datos Mongo en funcionamiento y una conexión válida a un nodo de Substrate.

## **Levantando el servicio (PROD)**

Para iniciar los contenedores del servicio de backend, la BD y Mongo Express ejecutar el siguiente comando:

```sh
docker-compose up -d
```

**Nota**: Se requiere una base de datos Mongo en funcionamiento y una conexión válida a un nodo de Substrate.
Opcionalmente, comente el servicio de back-end en el archivo docker-compose si desea ejecutar la imagen localmente.

## Ejecutar la imagen de Docker del servicio back-end

### Descarga la imagen de DockerHub

```sh
docker pull blockcoders/ink-substrate-explorer-api:latest
```

### Run

```sh
# Crear la red de docker
docker network create ink-explorer-network

# Correr servicio
docker run -it -p 5000:5000 --network ink-explorer-network --env-file {pathToEnvFile} blockcoders/ink-substrate-explorer-api:latest
```

#### Verifique que la imagen comenzó a ejecutarse

```sh
docker ps
```

El resultado debería verse así:

```sh
CONTAINER ID   IMAGE                                    COMMAND                  CREATED          STATUS          PORTS                                       NAMES
f31a7d0fd6c8   blockcoders/ink-substrate-explorer-api   "docker-entrypoint.s…"   15 seconds ago   Up 14 seconds   0.0.0.0:5000->5000/tcp, :::5000->5000/tcp   funny_lumiere
```

El servicio se conectará al contenedor DB y comenzará a procesar bloques.

## **Testing**

Ejecución de las pruebas unitarias.

```sh
pnpm test
```

Ejecución de la cobertura de pruebas.

```sh
pnpm test:cov
```

Probando las consultas de GraphQL.

```sh
{"level":30,"time":1664298430389,"pid":1388770,"hostname":"username","name":"ink-substrate-explorer-api","msg":"App listening on http://0.0.0.0:5000"}
```

Una vez que el servicio back-end se está ejecutando, se puede acceder a GraphQL Playground en http://localhost:5000/graphql

![backend](/.images/graphql_example.png)

## **Definicion de la API**

Una vez que el servicio esta levantado y corriendo correctamente se provee una API que puede utilizarse enviado consultas de GraphQL.

### **Consultas**

<span style="color:#2a98db"> **Status**: Recupera el estado de la aplicación</span>

```graphql
query {
  status
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

```graphql
{
  "data": {
    "status": "running"
  }
}
```

<span style="color:#2a98db"> **Version**: Recupera la version de la aplicación</span>

```graphql
query {
  status
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

```graphql
{
  "data": {
    "version": "v1.1.1"
  }
}
```

<span style="color:#2a98db"> **getBlock**: Recupera el bloque por hash </span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getBlocks**: Recupera bloques. Use 'skip' y 'take' para paginar. Use 'orderByNumber: false' para ordenar por tiempo y 'orderAsc: true' para ver primero los bloques más antiguos.</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getTransaction**: Recupera una sola transacción por hash</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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
      "tip": "0",
      "tokens": "Unit",
      "type": 4,
      "version": 132
    }
  }
}
```

<span style="color:#2a98db"> **getTransactionsByContract**: Recupera una lista de transacciones de un contrato.</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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
        "tip": "0",
        "tokens": "Unit",
        "type": 4,
        "version": 132
      }
    ]
  }
}
```

<span style="color:#2a98db"> **getTransactions**: Recupera transacciones por hash de bloque (use 'skip' y 'take' para paginar. use 'orderAsc' para ver primero las más antiguas o las más nuevas)</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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
        "tip": "0",
        "tokens": "Unit",
        "type": 4,
        "version": 4
      }
    ]
  }
}
```

<span style="color:#2a98db"> **getEvent**: Recupera un evento por su id</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getEvents**: Recupera eventos por dirección de contrato o hash de transacción (use 'skip' y 'take' para paginar, 'orderAsc' para ver primero los más antiguos o los más nuevos)</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getContract**: Recupera un contrato por address</span>

```graphql
query {
  getContract(address: "5G24svh2w4QXNhsHU5XBxf8N3Sw2MPu7sAemofv1bCuyxAzc") {
    address
    metadata
    hasMetadata
  }
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getContracts**: Recupera una lista de contratos</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getContractQueries**: Recupera un contrato. Si este contrato ha cargado metadatos, también recuperará las consultas y los métodos de transacción que se pueden ejecutar.</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

### **Mutaciones**

<span style="color:#2a98db"> **decodeEvent**: Decodifica los datos del evento para un evento específico. Requiere que los metadatos del contrato ya se hayan subido usando la mutación **uploadMetadata**</span>

```graphql
mutation {
  decodeEvent(
    contractAddress: "5ELpkDtq7werhT5ybZZMbVBcQTPNomvJP7j5kJQifv7GzVik"
    id: "972e782c-2517-5648-9bf1-4c693d2fed90"
  )
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

```graphql
{
  "data": {
    "decodeEvent": "{\"identifier\":\"Transfer\",\"decodedData\":{\"args\":[\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y\",\"0x000000000000000000002d79883d2000\"],\"event\":{\"args\":[{\"name\":\"from\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"to\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}],\"docs\":[\" Event emitted when a token transfer occurs.\"],\"identifier\":\"Transfer\",\"index\":0}},\"formattedData\":{\"from\":\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"to\":\"5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y\",\"value\":50}}"
  }
}
```

<span style="color:#2a98db"> **decodeEvents**: Decodifica los datos de eventos para un contrato específico (use 'skip' y 'take' para seleccionar los eventos y 'orderAsc' para ordenar por tiempo). Requiere que los metadatos del contrato ya se hayan subido usando la mutación **uploadMetadata**</span>

```graphql
mutation {
  decodeEvents(contract: "5DfG5TyaffuJ78rHP71cvkYEtktRkpeMiJNJyxd8Q5924GR8", skip: 0, take: 1, orderAsc: false)
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

```graphql
{
  "data": {
    "decodeEvents": "[{\"decodedData\":{\"args\":[\"5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc\",\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"0x00000000000000000000048c27395000\"],\"event\":{\"args\":[{\"name\":\"from\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"to\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}],\"docs\":[\" Event emitted when a token transfer occurs.\"],\"identifier\":\"Transfer\",\"index\":0}},\"formattedData\":{\"from\":\"5GVmSPghWsjACADGYi78dmhuZEgfgDwfixR7BM3aMEoNuTBc\",\"to\":\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"value\":5}}]"
  }
}
```

<span style="color:#2a98db"> **uploadMetadata**: Para decodificar eventos es necesario cargar el ABI del contrato. Pasar un ABI en base64 a esta mutación lo guardará en la base de datos. Después de eso, ejecute una consulta **decodeEvents** para ver los datos decodificados en los eventos.</span>

```graphql
mutation Upload {
  uploadMetadata(
    contractAddress: "5G24svh2w4QXNhsHU5XBxf8N3Sw2MPu7sAemofv1bCuyxAzc"
    metadata: "ewogICJzb3VyY2UiOiB7CiAgICAiaGFzaCI6I...(base64)"
  )
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

```graphql
{
  "data": {
    "uploadMetadata": true
  }
}
```

### **Acerca de la decodificación de eventos**

Para ver los datos decodificados de los eventos, hay un requisito: los metadatos del contrato deben cargarse al menos una vez.

Ejemplo de metadatos de un contrato ERC20:

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

Una vez cargado, los eventos se pueden decodificar mediante las mutaciones _decodeEvent_ o _decodeEvents_ que se encuentran en la sección **Mutaciones**.

**Nota**: Los metadatos deben cargarse como un texto (string) en **base64**.

Para obtener más información sobre la carga de metadatos, vaya a la sección **Mutaciones** y busque _uploadMetadata_.

## **Suscripciones**

La primera vez que se inicia el nodo, es posible que deba comenzar desde el bloque 0 y cargar todos los bloques (LOAD_ALL_BLOCKS env var debe establecerse en verdadero). Si desea comenzar desde un bloque específico, puede usar FIRST_BLOCK_TO_LOAD env var para comenzar desde otro bloque.

En caso de un tiempo de inactividad del nodo, las suscripciones se reconectarán automáticamente recuperando todos los bloques nuevos desde el último bloque que se procesó.

**Nota**: Cargar todos los bloques puede llevar mucho tiempo dependiendo de la cantidad de bloques que deban cargarse. Se recomienda utilizar un nodo con una conexión rápida a Internet. El nodo podrá procesar todos los bloques en unas pocas horas.

### Algunos puntos de referencia

#### Utilizando BLOCK_CONCURRENCY = 100

- 100 bloques en ~ 6 segundos
- 1000 bloques en ~ 30.5 segundos
- 10000 bloques en ~ 4:24 minutos
- 100000 bloques en ~ 39.57 minutos

#### Utilizando BLOCK_CONCURRENCY = 1000

- 100 bloques en ~ 0.5 segundos
- 1000 bloques en ~ 5 segundos
- 10000 bloques en ~ 3 minutos
- 100000 bloques en ~ 24 minutos

## Registro de cambios

Consulte [Changelog](CHANGELOG.md) para más información.

## Contribuye

¡Las contribuciones son bienvenidas! Consulte [Contributing](CONTRIBUTING.md).

## Colaboradores

- [**Jose Ramirez**](https://github.com/0xslipk)
- [**Fernando Sirni**](https://github.com/fersirni)
- [**Ruben Gutierrez**](https://github.com/RubenGutierrezC)

## Licencia

Con licencia de Apache 2.0 - consulte el archivo [LICENSE](LICENSE) para obtener más información.
