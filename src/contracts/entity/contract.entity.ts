import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm'
import { Event } from '../../events/entity/event.entity'

@ObjectType()
@Entity({ name: 'contracts' })
@Index(['address'])
export class Contract extends BaseEntity {
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

  @CreateDateColumn({
    default: /* istanbul ignore next */ () => 'NOW()',
  })
  createdDate!: Date
}
