import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'contracts' })
@Index(['hash'])
export class Contract extends BaseEntity {
  @PrimaryColumn()
  @Field(() => String)
  hash!: string

  @Column()
  @Field(() => String)
  metadata!: string

  @CreateDateColumn({
    default: () => 'NOW()',
  })
  createdDate!: Date
}