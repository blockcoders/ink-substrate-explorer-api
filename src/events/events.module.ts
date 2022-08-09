import { Module } from '@nestjs/common'
import { DBModule } from 'src/db/db.module'
import { EventsResolver } from './events.resolver'
import { EventsService } from './events.service'

@Module({
  imports: [DBModule],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
