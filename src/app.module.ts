import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'
import { AppResolver } from './app.resolver'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'
import { BlocksModule } from './modules/blocks.module'
import { EventsModule } from './modules/events.module'
import { TransactionsModule } from './modules/transactions.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      retryDelay: 3000,
      retryAttempts: 10,
    }),
    EnvModule,
    BlocksModule,
    EventsModule,
    TransactionsModule,
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
  ],
  providers: [AppResolver],
})
export class AppModule {}
