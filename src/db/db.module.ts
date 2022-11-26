import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Block } from '../blocks/entity/block.entity'
import { Contract } from '../contracts/entity/contract.entity'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { Event } from '../events/entity/event.entity'
import { Sync } from '../sync/entity/sync.entity'
import { Transaction } from '../transactions/entity/transaction.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService) => {
        const config: TypeOrmModuleOptions = {
          type: 'mongodb',
          host: env.DATABASE_HOST,
          port: env.DATABASE_PORT,
          username: env.DATABASE_USERNAME,
          password: env.DATABASE_PASSWORD,
          // database: env.DATABASE_NAME,
          // retryAttempts: env.DATABASE_RETRY_ATTEMPTS,
          // retryDelay: env.DATABASE_RETRY_DELAY,
          synchronize: true,
          autoLoadEntities: true,
          // keepConnectionAlive: false,
        }

        if (!env.DATABASE_SSL_CA) {
          return config
        }

        return {
          ...config,
          // ssl: {
          //   ca: env.DATABASE_SSL_CA,
          //   rejectUnauthorized: false,
          // },
        }
      },
    }),
    TypeOrmModule.forFeature([Block, Transaction, Event, Contract, Sync]),
  ],
  exports: [TypeOrmModule],
})
export class DBModule {}
