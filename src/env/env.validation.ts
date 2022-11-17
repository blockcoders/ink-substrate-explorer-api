import { plainToClass } from 'class-transformer'
import { IsBooleanString, IsEnum, IsNumberString, IsString, validateSync } from 'class-validator'
import { Level as PinoLevel } from 'pino'

export enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development

  @IsString()
  PORT = '3000'

  @IsString()
  LOG_NAME = 'ethereum-backend'

  @IsString()
  LOG_LEVEL: PinoLevel = 'debug'

  @IsBooleanString()
  GRAPHQL_DEBUG: string | undefined

  @IsBooleanString()
  GRAPHQL_PLAYGROUND: string | undefined

  @IsBooleanString()
  GRAPHQL_SORT_SCHEMA: string | undefined

  @IsBooleanString()
  GRAPHQL_INTROSPECTION: string | undefined

  @IsString()
  DATABASE_HOST: string | undefined

  @IsNumberString()
  DATABASE_PORT: string | undefined

  @IsString()
  DATABASE_NAME: string | undefined

  @IsString()
  DATABASE_USERNAME: string | undefined

  @IsString()
  DATABASE_PASSWORD: string | undefined

  @IsString()
  DATABASE_SSL_CA: string | undefined

  @IsNumberString()
  DATABASE_RETRY_ATTEMPTS: string | undefined

  @IsNumberString()
  DATABASE_RETRY_DELAY: string | undefined

  @IsString()
  WS_PROVIDER: string | undefined

  @IsBooleanString()
  LOAD_ALL_BLOCKS: boolean | undefined

  @IsNumberString()
  FIRST_BLOCK_TO_LOAD: number | undefined

  @IsNumberString()
  BLOCKS_CONCURRENCY: number | undefined
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
