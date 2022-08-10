import { Field, Int, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, Entity, Index, PrimaryColumn, Unique } from 'typeorm'

@ObjectType()
@Entity({ name: 'blocks' })
@Index(['hash', 'number'])
@Unique(['parentHash', 'number'])
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

  //transactions: Transaction[] = []
}
