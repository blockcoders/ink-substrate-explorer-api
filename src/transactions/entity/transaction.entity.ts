import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  ObjectID,
  ObjectIdColumn,
  OneToMany,
} from 'typeorm'
import { Block } from '../../blocks/entity/block.entity'
import { Event } from '../../events/entity/event.entity'

@ObjectType()
@Entity({ name: 'transactions' })
@Index(['signer'])
export class Transaction extends BaseEntity {
  @ObjectIdColumn()
  _id!: ObjectID

  @Column({
    unique: true,
  })
  @Field(/* istanbul ignore next */ () => String)
  hash!: string

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  blockHash!: string

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  section!: string

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  method!: string

  @Column('bigint')
  @Field(/* istanbul ignore next */ () => Float)
  timestamp!: number

  @ManyToOne(/* istanbul ignore next */ () => Block, /* istanbul ignore next */ (block: Block) => block.transactions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  block!: Block

  @OneToMany(/* istanbul ignore next */ () => Event, /* istanbul ignore next */ (event: Event) => event.transaction, {
    nullable: true,
  })
  events!: Event[]

  @Column()
  @Field(/* istanbul ignore next */ () => String)
  signature?: string

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  signer?: string

  @Column('int')
  @Field(/* istanbul ignore next */ () => Int, { nullable: true })
  nonce?: number

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  tip?: string

  @Column('int')
  @Field(/* istanbul ignore next */ () => Int, { nullable: true })
  version?: number

  @Column('int')
  @Field(/* istanbul ignore next */ () => Int, { nullable: true })
  type?: number

  @Column('int')
  @Field(/* istanbul ignore next */ () => Int, { nullable: true })
  encodedLength?: number

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  callIndex?: string

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  decimals?: string

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  ss58?: string

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  tokens?: string

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  era?: string

  @Column()
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  args?: string

  @CreateDateColumn({
    default: /* istanbul ignore next */ () => 'NOW()',
  })
  createdDate!: Date
}
