import { Module, forwardRef } from '@nestjs/common'
import { DBModule } from '../db/db.module'
import { EventsModule } from '../events/events.module'
import { ContractsResolver } from './contracts.resolver'
import { ContractsService } from './contracts.service'

@Module({
  imports: [DBModule, forwardRef(() => EventsModule)],
  providers: [ContractsService, ContractsResolver],
  exports: [ContractsService],
})
export class ContractsModule {}
