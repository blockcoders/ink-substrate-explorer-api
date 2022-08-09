import { Module } from '@nestjs/common'
import { DBModule } from 'src/db/db.module'
import { BlocksResolver } from './blocks.resolver'
import { BlocksService } from './blocks.service'

@Module({
  imports: [DBModule],
  providers: [BlocksResolver, BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
