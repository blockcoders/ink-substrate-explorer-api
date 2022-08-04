import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Event from './event.entity'
import { EventsResolver } from './events.resolver'
import { EventsService } from './events.service'

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsResolver, EventsService],
})
export class EventsModule {}
