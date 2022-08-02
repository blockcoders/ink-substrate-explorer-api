import { plainToClass } from 'class-transformer'
import { IsBooleanString, IsEnum, IsString, validateSync } from 'class-validator'
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
  GRAPHQL_DEBUG = false

  @IsBooleanString()
  GRAPHQL_PLAYGROUND = false

  @IsBooleanString()
  GRAPHQL_SORT_SCHEMA = true

  @IsBooleanString()
  GRAPHQL_INTROSPECTION = false
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
