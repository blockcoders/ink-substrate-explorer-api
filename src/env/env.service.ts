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
  public readonly DATABASE_HOST: string
  public readonly DATABASE_PORT: number
  public readonly DATABASE_NAME: string
  public readonly DATABASE_USERNAME: string
  public readonly DATABASE_PASSWORD: string
  public readonly DATABASE_SSL_CA: string
  public readonly DATABASE_RETRY_ATTEMPTS: number
  public readonly DATABASE_RETRY_DELAY: number
  public readonly WS_PROVIDER: string
  public readonly LOAD_ALL_BLOCKS: boolean
  public readonly FIRST_BLOCK_TO_LOAD: number
  public readonly BLOCKS_CONCURRENCY: number

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
    this.DATABASE_HOST = this.config.get<string>('DATABASE_HOST', 'localhost')
    this.DATABASE_PORT = parseInt(this.config.get<string>('DATABASE_PORT', '5432'), 10)
    this.DATABASE_NAME = this.config.get<string>('DATABASE_NAME', '')
    this.DATABASE_USERNAME = this.config.get<string>('DATABASE_USERNAME', '')
    this.DATABASE_PASSWORD = this.config.get<string>('DATABASE_PASSWORD', 'password')
    this.DATABASE_SSL_CA = this.config.get<string>('DATABASE_SSL_CA', '')
    this.DATABASE_RETRY_ATTEMPTS = parseInt(this.config.get<string>('DATABASE_RETRY_ATTEMPTS', '20'), 10)
    this.DATABASE_RETRY_DELAY = parseInt(this.config.get<string>('DATABASE_RETRY_DELAY', '6000'), 10)
    this.WS_PROVIDER = this.config.get<string>('WS_PROVIDER', '')
    this.LOAD_ALL_BLOCKS = config.get<string>('LOAD_ALL_BLOCKS', 'false') === 'true'
    this.FIRST_BLOCK_TO_LOAD = parseInt(this.config.get<string>('FIRST_BLOCK_TO_LOAD', '0'), 10)
    this.BLOCKS_CONCURRENCY = parseInt(this.config.get<string>('BLOCKS_CONCURRENCY', '1000'), 10)
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
