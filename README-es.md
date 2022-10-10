Ink! Explorer API
=================

[![App Build](https://github.com/blockcoders/ink-substrate-explorer-api/actions/workflows/pr.yaml/badge.svg)](https://github.com/blockcoders/ink-substrate-explorer-api/actions/workflows/pr.yaml)
[![Coverage Status](https://coveralls.io/repos/github/blockcoders/ink-substrate-explorer-api/badge.svg?branch=main)](https://coveralls.io/github/blockcoders/ink-substrate-explorer-api?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/blockcoders/ink-substrate-explorer-api/badge.svg)](https://snyk.io/test/github/blockcoders/ink-substrate-explorer-api)

## **Acerca del explorador**

Ink Explorer es una aplicacion que provee informacion relativa a los contratos que utilizan Ink! en blockchains basadas en Substrate. Se suscribe a la blockchain y a los eventos emitidos por los modulos de Ink! y guarda la informacion en su propia base de datos PostgreSQL. El back-end expone una API que puede interactuar con la base de datos y ejecutar consultas rapidas para obtener informacion especifica en poco tiempo.

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

**Nota**: El archivo .env tiene la configuracion para GraphQL, la base de datos PostgreSQL, Node y la url del RPC de la blockchain basada en Substrate.

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
DATABASE_HOST=postgres
DATABASE_NAME=ink
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
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

### Instanciar una BD Postgres utilizando docker (opcional)

Para levantar el servicio es necesario contar con una **BD PostgreSQL**. Para esto, el archivo **dev-docker-compose.yaml** ya tiene una imagen configurada lista para usar.
Ejecutando el siguiente comando tambien instanciara un contenedor para pgAdmin:

```sh
docker-compose -f dev-docker-compose.yaml up -d
```

Una vez que el servicio se está ejecutando, se puede acceder a pgAdmin siguiendo el enlace que se muestra en la terminal (en este caso localhost:80).

![pgAdmin](/.images/pg_admin_up.png)

Las credenciales para acceder a pgAdmin son (establecidas en el archivo dev-docker-compose):

- PGADMIN_DEFAULT_EMAIL: "admin@admin.com"
- PGADMIN_DEFAULT_PASSWORD: "admin"

Registre un nuevo servidor en pgAdmin y establezca las credenciales para la base de datos PostgreSQL:

Haga clic derecho en 'Servidores' y seleccione "Registrarse" -> "Servidor"

![pgAdmin](/.images/pg_admin_select_server.png)

Establezca un nombre para el servidor (en este ejemplo, "Docker")

![pgAdmin](/.images/pg_admin_server_name.png)

Establezca las credenciales para la base de datos PostgreSQL (esto se puede encontrar en el archivo dev-docker-compose):

![pgAdmin](/.images/pg_admin_connection.png)

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

**Nota**: Se requiere una base de datos postgres en funcionamiento y una conexión válida a un nodo de Substrate.

## **Levantando el servicio (PROD)**

Para iniciar los contenedores del servicio de backend, la BD y pgAdmin ejecutar el siguiente comando:

```sh
docker-compose up -d
```
**Nota**: Se requiere una base de datos postgres en funcionamiento y una conexión válida a un nodo de Substrate.
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

<span style="color:#2a98db"> **getBlock**: Recupera el bloque por hash </span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getBlocks**: Recupera bloques (use skip and take para paginar)</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getTransaction**: Recupera una sola transacción por hash</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getTransactions**: Recupera transacciones por hash de bloque (use skip and take para paginar)</span>

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

<span style="color:#5EBA7D"> Respuesta: </span>

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

<span style="color:#2a98db"> **getEvents**: Recupera eventos por dirección de contrato o hash de transacción (use skip and take para paginar)</span>

```graphql
query {
  getEvents(contract: "5F7FvAUyB6ok4Sj3j82x315F3pDCZSiGovxWcnjadnpSMi7t") {
    id
    index
    method
    section
    topics
    transactionHash
  }
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

```graphql
{
  "data": {
    "getEvents": [
      {
        "id": "c3250479-e53e-5a4d-ba0c-b688764cd81b",
        "index": "0x0703",
        "section": "contracts",
        "method": "ContractEmitted",
        "transactionHash": "0x1080eb1f8de1ee5b0c1bd584924951c38b998bc7596773ef5e1a92908409a17f",
        "topics": "[0x0045726332303a3a5472616e7366657200000000000000000000000000000000, 0x33766995fd9b44bd45f351b3abd7e5041960638db0075c84ab7af1a734e20d1b, 0x5445726332303a3a5472616e736665723a3a66726f6d00000000000000000000]"
      },
      {
        "id": "509f2fb6-ed61-5dc7-a567-3cfa55e1fa65",
        "index": "0x0703",
        "section": "contracts",
        "method": "ContractEmitted",
        "transactionHash": "0x2a009bf5fdc388f10953cba4661c3ca74e0252c1fcae6ba7f39f4eb7be707caa",
        "topics": "[0x0045726332303a3a5472616e7366657200000000000000000000000000000000, 0x2b00c7d40fe6d84d660f3e6bed90f218e022a0909f7e1a7ea35ada8b6e003564, 0xda2d695d3b5a304e0039e7fc4419c34fa0c1f239189c99bb72a6484f1634782b]"
      }
    ]
  }
}
```

<span style="color:#2a98db"> **decodeEvents**: Decodifica los datos de eventos para un contrato específico. Requiere que los metadatos del contrato ya se hayan subido usando la mutación **uploadMetadata**</span>

```graphql
query {
  decodeEvents(contractAddress: "5G24svh2w4QXNhsHU5XBxf8N3Sw2MPu7sAemofv1bCuyxAzc")
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

```graphql
{
  "data": {
    "decodeEvents": "[{\"args\":[null,\"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY\",\"0x000000000000000000038d7ea4c68000\"],\"event\":{\"args\":[{\"name\":\"from\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"to\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}],\"docs\":[\" Event emitted when a token transfer occurs.\"],\"identifier\":\"Transfer\",\"index\":0}},{\"args\":[\"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY\",\"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty\",\"0x00000000000000000001c6bf52634000\"],\"event\":{\"args\":[{\"name\":\"from\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"to\",\"type\":{\"info\":9,\"lookupIndex\":11,\"type\":\"Option<AccountId>\",\"docs\":[],\"namespace\":\"Option\",\"sub\":{\"info\":10,\"lookupIndex\":2,\"type\":\"AccountId\",\"docs\":[],\"namespace\":\"ink_env::types::AccountId\",\"lookupNameRoot\":\"InkEnvAccountId\"}}},{\"name\":\"value\",\"type\":{\"info\":10,\"type\":\"Balance\"}}],\"docs\":[\" Event emitted when a token transfer occurs.\"],\"identifier\":\"Transfer\",\"index\":0}}]"
  }
}
```

<span style="color:#2a98db"> **getContract**: Recupera un contrato por dirección</span>

```graphql
query {
  getContract(address: "5G24svh2w4QXNhsHU5XBxf8N3Sw2MPu7sAemofv1bCuyxAzc") {
    address
    metadata
  }
}
```

<span style="color:#5EBA7D"> Respuesta: </span>

```graphql
{
  "data": {
    "getContract": {
      "address": "5G24svh2w4QXNhsHU5XBxf8N3Sw2MPu7sAemofv1bCuyxAzc",
      "metadata": "{\n  \"source\": {\n    \"hash\": ...   }\n}\n"
    }
  }
}
```

### **Mutaciones**

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

Una vez cargado, los eventos se pueden decodificar mediante la consulta _decodeEvents_ que se encuentra en la sección **Consultas**.

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

* [__Jose Ramirez__](https://github.com/0xslipk)
* [__Fernando Sirni__](https://github.com/fersirni)
* [__Ruben Gutierrez__](https://github.com/RubenGutierrezC)

## Licencia

Con licencia de Apache 2.0 - consulte el archivo [LICENSE](LICENSE) para obtener más información.
