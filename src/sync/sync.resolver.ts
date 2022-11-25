import { Query, Resolver } from '@nestjs/graphql'
import { Sync } from './entity/sync.entity'
import { SyncService } from './sync.service'

@Resolver(() => Sync)
export class SyncResolver {
  constructor(private syncService: SyncService) {}

  @Query(/* istanbul ignore next */ () => Sync)
  async getSync() {
    return this.syncService.find()
  }
}
