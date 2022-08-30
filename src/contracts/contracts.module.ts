import { Module, forwardRef } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsResolver } from './contracts.resolver';
import { DBModule } from '../db/db.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [DBModule, forwardRef(() => EventsModule)],
  providers: [ContractsService, ContractsResolver],
  exports: [ContractsService],
})
export class ContractsModule {}
