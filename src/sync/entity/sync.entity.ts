import { Float, ObjectType, Field } from '@nestjs/graphql'
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'syncs' })
export class Sync extends BaseEntity {
  @PrimaryColumn({
    unique: true,
  })
  @Field(/* istanbul ignore next */ () => Float)
  id!: number

  @Column()
  @Field(/* istanbul ignore next */ () => Float)
  lastSynced!: number

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  status!: string

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  timestamp!: string
}
