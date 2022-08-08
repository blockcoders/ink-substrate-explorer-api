import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { Block } from '../blocks/entity/block.entity'
import { Event } from '../events/entity/event.entity'
import { Transaction } from '../transactions/entity/transaction.entity'

@Module({
  imports: [
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
    TypeOrmModule.forFeature([Block, Transaction, Event]),
  ],
  exports: [TypeOrmModule],
})
export class DBModule {}
