import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { EnvService } from './env.service'

describe('EnvService', () => {
  let service: EnvService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [EnvService],
    }).compile()

    service = module.get<EnvService>(EnvService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('isProduction', () => {
    it('should be false', () => {
      expect(service.isProduction()).toBeFalsy()
    })
  })

  describe('isDevelopment', () => {
    it('should be false', () => {
      expect(service.isDevelopment()).toBeFalsy()
    })
  })

  describe('isTest', () => {
    it('should be true', () => {
      expect(service.isTest()).toBeTruthy()
    })
  })

  describe('isStaging', () => {
    it('should be false', () => {
      expect(service.isStaging()).toBeFalsy()
    })
  })

  describe('getPinoConfig', () => {
    it('should return a instance of PinoParams', () => {
      expect(service.getPinoConfig()).toEqual(
        expect.objectContaining({
          pinoHttp: {
            name: expect.any(String),
            level: expect.any(String),
            autoLogging: expect.any(Boolean),
            transport: {
              target: expect.any(String),
              options: {
                colorize: expect.any(Boolean),
                singleLine: expect.any(Boolean),
                translateTime: expect.any(Boolean),
              },
            },
          },
        }),
      )
    })
  })
})
