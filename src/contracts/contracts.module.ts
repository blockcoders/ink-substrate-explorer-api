import { Module, forwardRef } from '@nestjs/common'
import { EnvModule } from 'src/env/env.module'
import { DBModule } from '../db/db.module'
import { EventsModule } from '../events/events.module'
import { ContractsResolver } from './contracts.resolver'
import { ContractsService } from './contracts.service'

@Module({
  imports: [EnvModule, DBModule, forwardRef(() => EventsModule)],
  providers: [ContractsResolver, ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
