import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Block extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  hash!: string

  @Column()
  parentHash!: string

  @Column('int')
  number!: number

  // transactions: Transaction[] = []
}
