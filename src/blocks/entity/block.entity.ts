import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm'
import { Transaction } from '../../transactions/entity/transaction.entity'

@ObjectType()
@Entity({ name: 'blocks' })
@Index(['hash', 'number'])
export class Block extends BaseEntity {
  @PrimaryColumn({
    unique: true,
  })
  @Field(/* istanbul ignore next */ () => String)
  hash!: string

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  parentHash!: string

  @Column('int')
  @Field(/* istanbul ignore next */ () => Int)
  number!: number

  @Column('bigint')
  @Field(/* istanbul ignore next */ () => Float)
  timestamp!: number

  @Column('bigint')
  @Field(/* istanbul ignore next */ () => Float)
  encodedLength!: number

  @OneToMany(
    /* istanbul ignore next */ () => Transaction,
    /* istanbul ignore next */ (transaction: Transaction) => transaction.block,
  )
  transactions!: Transaction[]

  @CreateDateColumn({
    default: /* istanbul ignore next */ () => 'NOW()',
  })
  createdDate!: Date
}
