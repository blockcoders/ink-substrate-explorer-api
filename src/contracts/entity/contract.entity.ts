import { Field, ObjectType } from '@nestjs/graphql'
import { Event } from '../../events/entity/event.entity'
import { BaseEntity, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'contracts' })
@Index(['address'])
export class Contract extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  address!: string
  
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  metadata?: string

  @OneToMany(() => Event, (event: Event) => event.contract, { nullable: true })
  events!: Event[]

  @CreateDateColumn({
    default: () => 'NOW()',
  })
  createdDate!: Date
}
