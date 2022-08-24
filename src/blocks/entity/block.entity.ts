import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Transaction } from '../../transactions/entity/transaction.entity'
import { BaseEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'blocks' })
@Index(['hash', 'number'])
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

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.block)
  transactions!: Transaction[]

  @CreateDateColumn({
    default: () => 'NOW()',
  })
  createdDate!: Date
}
