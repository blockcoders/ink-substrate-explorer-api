import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'
import { AppResolver } from './app.resolver'
import { BlocksModule } from './blocks/blocks.module'
import { BlocksResolver } from './blocks/blocks.resolver'
import { BlocksService } from './blocks/blocks.service'
import { DBModule } from './db/db.module'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'
import { EventsModule } from './events/events.module'
import { EventsResolver } from './events/events.resolver'
import { EventsService } from './events/events.service'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { TransactionsModule } from './transactions/transactions.module'
import { TransactionsResolver } from './transactions/transactions.resolver'
import { TransactionsService } from './transactions/transactions.service'
import { ContractsModule } from './contracts/contracts.module';
import { ContractsService } from './contracts/contracts.service'
import { ContractsResolver } from './contracts/contracts.resolver'

@Module({
  imports: [
    EnvModule,
    LoggerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => env.getPinoConfig(),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [EnvModule, BlocksModule, EventsModule, TransactionsModule],
      inject: [EnvService],
      driver: ApolloDriver,
      useFactory: (env: EnvService) => {
        return {
          sortSchema: env.GRAPHQL_SORT_SCHEMA,
          debug: env.GRAPHQL_DEBUG,
          playground: env.GRAPHQL_PLAYGROUND,
          autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
          introspection: env.GRAPHQL_INTROSPECTION,
          uploads: false
        }
      },
    }),
    DBModule,
    BlocksModule,
    EventsModule,
    TransactionsModule,
    ContractsModule,
    SubscriptionsModule,
  ],
  providers: [
    AppResolver,
    BlocksResolver,
    BlocksService,
    EventsResolver,
    EventsService,
    TransactionsResolver,
    TransactionsService,
    ContractsResolver,
    ContractsService,
  ],
})
export class AppModule {}
