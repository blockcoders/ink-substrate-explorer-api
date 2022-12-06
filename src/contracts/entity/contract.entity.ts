import { Field, ObjectType } from '@nestjs/graphql'
import { AbiParam } from '@polkadot/api-contract/types'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { Event } from '../../events/entity/event.entity'

@ObjectType()
@Entity({ name: 'contracts' })
@Index(['address'])
export class Contract extends BaseEntity {
  @ObjectIdColumn()
  _id!: ObjectID

  @Column({
    unique: true,
  })
  @PrimaryColumn()
  @Field(/* istanbul ignore next */ () => String)
  address!: string

  @Column({ nullable: true })
  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  metadata?: string

  @OneToMany(/* istanbul ignore next */ () => Event, /* istanbul ignore next */ (event: Event) => event.contract, {
    nullable: true,
  })
  events!: Event[]

  @Field(/* istanbul ignore next */ () => [ContractQuery])
  queries?: ContractQuery[]

  @CreateDateColumn({
    default: /* istanbul ignore next */ () => 'NOW()',
  })
  createdDate!: Date
}

@ObjectType()
export class ContractQuery {
  @Field(/* istanbul ignore next */ () => String)
  name!: string

  @Field(/* istanbul ignore next */ () => String)
  method!: string

  @Field(/* istanbul ignore next */ () => [String])
  args!: AbiParam[] | string[]

  @Field(/* istanbul ignore next */ () => [String])
  docs!: string[]
}
