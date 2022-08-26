import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'contracts' })
@Index(['address'])
export class Contract extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  address!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  fileName?: string
  
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  metadata?: string

  @CreateDateColumn({
    default: () => 'NOW()',
  })
  createdDate!: Date
}
