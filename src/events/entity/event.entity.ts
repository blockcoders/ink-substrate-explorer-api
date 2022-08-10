import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'events' })
@Index(['contract'])
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id!: string

  @Column()
  @Field(() => String)
  contract!: string

  @Column()
  @Field(() => String)
  index!: string

  @Column()
  @Field(() => String)
  section!: string

  @Column()
  @Field(() => String)
  method!: string

  @Column()
  @Field(() => String)
  topics!: string

  // phase: FrameSystemPhase
  // meta: EventMetadataLatest
  // typeDef: any
  @Column()
  @Field(() => String)
  data!: string
}
