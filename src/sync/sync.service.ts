import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { UpdateSyncDto } from './dto/updateSync.dto'
import { Sync } from './entity/sync.entity'

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Sync)
    private readonly syncRepository: MongoRepository<Sync>,
  ) {}

  async find(): Promise<Sync | null> {
    const sync = await this.syncRepository.findOneBy({ id: 1 })
    return sync
  }

  async updateSync(data: UpdateSyncDto): Promise<any> {
    return await this.syncRepository.findOneAndUpdate({ id: 1 }, { $set: data })
  }

  async finishSync(): Promise<void> {
    await this.syncRepository.findOneAndUpdate({ id: 1 }, { $set: { status: 'synced' } })
  }

  async createSync(): Promise<Sync> {
    const sync = await this.syncRepository.create({ id: 1, status: 'syncing', timestamp: '0', lastSynced: 0 })
    return await sync.save()
  }
}
