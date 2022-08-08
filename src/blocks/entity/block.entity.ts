import { Field, Int, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'blocks' })
export class Block extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
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
