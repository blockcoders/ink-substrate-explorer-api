import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'
import { AppResolver } from './app.resolver'
import { BlocksModule } from './blocks/blocks.module'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'
import { EventsModule } from './events/events.module'
import { TransactionsModule } from './transactions/transactions.module'

@Module({
  imports: [
    EnvModule,
    LoggerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => env.getPinoConfig(),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [EnvModule],
      inject: [EnvService],
      driver: ApolloDriver,
      useFactory: (env: EnvService) => {
        return {
          sortSchema: env.GRAPHQL_SORT_SCHEMA,
          debug: env.GRAPHQL_DEBUG,
          playground: env.GRAPHQL_PLAYGROUND,
          autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
          introspection: env.GRAPHQL_INTROSPECTION,
        }
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => {
        return {
          type: 'postgres',
          host: env.DATABASE_HOST,
          port: env.DATABASE_PORT,
          username: env.DATABASE_USERNAME,
          password: env.DATABASE_PASSWORD,
          database: env.DATABASE_NAME,
          retryAttempts: env.DATABASE_RETRY_ATTEMPTS,
          retryDelay: env.DATABASE_RETRY_DELAY,
          synchronize: true,
          autoLoadEntities: true,
          keepConnectionAlive: false,
        }
      },
    }),
    BlocksModule,
    EventsModule,
    TransactionsModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
