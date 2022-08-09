import { Field, Int, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'blocks' })
export class Block extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  hash!: string

  @Column()
  @Field(() => String)
  parentHash!: string

  @Column('int')
  @Field(() => Int)
  number!: number

  // transactions: Transaction[] = []
}
