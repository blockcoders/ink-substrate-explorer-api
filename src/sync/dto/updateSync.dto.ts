import { IsNumber, IsOptional, IsString } from 'class-validator'

/* istanbul ignore file */
export class UpdateSyncDto {
  @IsNumber()
  lastSynced!: number

  @IsOptional()
  @IsString()
  status?: string

  @IsString()
  timestamp!: string
}
