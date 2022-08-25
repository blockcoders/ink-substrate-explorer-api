import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsResolver } from './contracts.resolver';
import { DBModule } from '../db/db.module';

@Module({
  imports: [DBModule],
  providers: [ContractsService, ContractsResolver],
  exports: [ContractsService],
})
export class ContractsModule {}
