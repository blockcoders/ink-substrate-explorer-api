import { getLoggerToken } from 'nestjs-pino'

export const mockPinoService = (serviceName: string) => ({
  provide: getLoggerToken(serviceName),
  useValue: {
    info: (error: any) => console.log(error),
    debug: (msg: any) => console.log(msg),
    error: (error: any) => console.log(error),
  },
})
