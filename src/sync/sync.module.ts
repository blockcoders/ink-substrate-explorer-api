import { Module } from '@nestjs/common'
import { DBModule } from '../db/db.module'
import { EnvModule } from '../env/env.module'
import { SyncResolver } from './sync.resolver'
import { SyncService } from './sync.service'

@Module({
  imports: [EnvModule, DBModule],
  providers: [SyncResolver, SyncService],
  exports: [SyncService],
})
export class SyncModule {}
