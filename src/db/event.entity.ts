import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  contract!: string

  @Column()
  index!: string

  @Column()
  section!: string

  @Column()
  method!: string

  @Column()
  topics!: string

  // phase: FrameSystemPhase
  // meta: EventMetadataLatest
  // typeDef: any
  // data: any
}
