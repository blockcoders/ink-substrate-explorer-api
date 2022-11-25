import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateSyncDto } from './dto/updateSync.dto'
import { Sync } from './entity/sync.entity'

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Sync)
    private readonly syncRepository: Repository<Sync>,
  ) {}

  async find(): Promise<Sync | null> {
    const sync = await this.syncRepository.findOneBy({ id: 1 })
    return sync
  }

  async updateSync(data: UpdateSyncDto): Promise<any> {
    await this.syncRepository.update({ id: 1 }, data)
  }

  async finishSync(): Promise<void> {
    await this.syncRepository.update({ id: 1 }, { status: 'synced' })
  }

  async createSync(): Promise<Sync> {
    const sync = await this.syncRepository.create({ id: 1, status: 'syncing', timestamp: '0', lastSynced: 0 })
    return await sync.save()
  }
}
