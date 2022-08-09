import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  providers: [SubscriptionsService]
})
export class SubscriptionsModule {}
