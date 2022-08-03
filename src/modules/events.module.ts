import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Event from '../models/event.entity'
import { EventsResolver } from '../resolvers/events.resolver'
import { EventsService } from '../services/events.service'

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsResolver, EventsService],
})
export class EventsModule {}
