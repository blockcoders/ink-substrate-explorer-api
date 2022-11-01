import { Field, Float, ObjectType } from '@nestjs/graphql'
import { DecodedEvent } from '@polkadot/api-contract/types'
import { Codec } from '@polkadot/types-codec/types'
import { IEventData } from '@polkadot/types/types'
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm'
import { Contract } from '../../contracts/entity/contract.entity'
import { Transaction } from '../../transactions/entity/transaction.entity'

@ObjectType()
@Entity({ name: 'events' })
export class Event extends BaseEntity {
  @PrimaryColumn()
  @Field(/* istanbul ignore next */ () => String)
  id!: string

  @ManyToOne(/* istanbul ignore next */ () => Contract, (contract: Contract) => contract.events, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  contract?: Contract

  @Column({ nullable: true })
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  transactionHash?: string

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  index!: string

  @Column({ nullable: true })
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  identifier?: string

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  section!: string

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  method!: string

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  topics!: string

  @Column('bigint')
  @Field(/* istanbul ignore next */ () => Float)
  timestamp!: number

  @ManyToOne(
    /* istanbul ignore next */ () => Transaction,
    /* istanbul ignore next */ (transaction: Transaction) => transaction.events,
    {
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn()
  transaction!: Transaction

  @Column({ type: 'jsonb', nullable: true, default: {} })
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  data?: Codec[] & IEventData

  @Column({ type: 'jsonb', nullable: true, default: {} })
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  decodedData?: DecodedEvent

  @CreateDateColumn({
    default: /* istanbul ignore next */ () => 'NOW()',
  })
  createdDate!: Date
}
