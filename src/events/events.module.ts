import { Module, forwardRef } from '@nestjs/common'
import { DBModule } from 'src/db/db.module'
import { ContractsModule } from '../contracts/contracts.module'
import { EventsResolver } from './events.resolver'
import { EventsService } from './events.service'

@Module({
  imports: [DBModule, forwardRef(() => ContractsModule)],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
