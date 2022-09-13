import { getLoggerToken } from 'nestjs-pino'

export const mockPinoService = (serviceName: string) => ({
  provide: getLoggerToken(serviceName),
  useValue: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
})
