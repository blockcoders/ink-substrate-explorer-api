import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Params as PinoParams } from 'nestjs-pino'
import { Level as PinoLevel } from 'pino'
import { Options } from 'pino-http'
import { Environment } from '../env/env.validation'

@Injectable()
export class EnvService {
  public readonly NODE_ENV: Environment
  public readonly PORT: number
  public readonly API_BASE_PATH: string
  public readonly LOG_NAME: string
  public readonly LOG_LEVEL: PinoLevel
  public readonly GRAPHQL_DEBUG: boolean
  public readonly GRAPHQL_PLAYGROUND: boolean
  public readonly GRAPHQL_SORT_SCHEMA: boolean
  public readonly GRAPHQL_INTROSPECTION: boolean
  /*public readonly POSTGRES_HOST: string
  public readonly POSTGRES_PORT: number
  public readonly POSTGRES_USER: string
  public readonly POSTGRES_PASSWORD: string
  public readonly POSTGRES_DB: string*/

  constructor(private readonly config: ConfigService) {
    // public env variables
    this.NODE_ENV = this.config.get<Environment>('NODE_ENV', Environment.Development)
    this.PORT = parseInt(this.config.get<string>('PORT', '8080'), 10)
    this.API_BASE_PATH = this.config.get<string>('API_BASE_PATH', '/api/v1')
    this.LOG_NAME = this.config.get<string>('LOG_NAME', 'ethereum-backend')
    this.LOG_LEVEL = this.config.get<PinoLevel>('LOG_LEVEL', 'debug')
    this.GRAPHQL_DEBUG = config.get<string>('GRAPHQL_DEBUG', 'false') === 'true'
    this.GRAPHQL_PLAYGROUND = config.get<string>('GRAPHQL_PLAYGROUND', 'false') === 'true'
    this.GRAPHQL_SORT_SCHEMA = config.get<string>('GRAPHQL_SORT_SCHEMA', 'true') === 'true'
    this.GRAPHQL_INTROSPECTION = config.get<string>('GRAPHQL_INTROSPECTION', 'false') === 'true'
    /*this.POSTGRES_HOST = config.get<string>('POSTGRES_HOST', 'localhost')
    this.POSTGRES_PORT = parseInt(config.get<string>('POSTGRES_PORT', '5432'))
    this.POSTGRES_USER = config.get<string>('POSTGRES_USER', 'root')
    this.POSTGRES_PASSWORD = config.get<string>('POSTGRES_PASSWORD', 'root')
    this.POSTGRES_DB = config.get<string>('POSTGRES_DB', 'ink')*/
  }

  public isProduction(): boolean {
    return this.NODE_ENV === Environment.Production
  }

  public isDevelopment(): boolean {
    return this.NODE_ENV === Environment.Development
  }

  public isTest(): boolean {
    return this.NODE_ENV === Environment.Test
  }

  public isStaging(): boolean {
    return this.NODE_ENV === Environment.Staging
  }

  public getPinoConfig(): PinoParams {
    const pinoHttp: Options = {
      name: this.LOG_NAME,
      level: this.LOG_LEVEL,
      autoLogging: false,
    }

    if (this.isDevelopment() || this.isTest()) {
      pinoHttp.transport = {
        target: 'pino-pretty',
        options: { colorize: true, singleLine: true, translateTime: true },
      }
    }

    return { pinoHttp }
  }
}
