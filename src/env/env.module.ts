import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvService } from './env.service'
import { Environment, validate } from './env.validation'

let envFilePath: string | undefined

if (process.env.NODE_ENV === Environment.Test) {
  envFilePath = '.env.test'
}

@Module({
  imports: [ConfigModule.forRoot({ cache: true, validate, envFilePath })],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
