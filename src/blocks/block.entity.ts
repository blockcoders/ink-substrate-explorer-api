import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Header, Extrinsic, Hash } from '@polkadot/types/interfaces'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import Transaction from '../transactions/transaction.entity'

@Entity()
@ObjectType()
export default class Block {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  hash: string

  @Column()
  @Field(() => String, { description: 'Hash of the previous block' })
  parentHash: string

  @Column('int')
  @Field(() => Int)
  number: number

  @Field(() => [Transaction], { description: 'List of transactions corresponding to this block' })
  transactions: Transaction[] = []

  constructor(hash: Hash, header: Header, extrinsics: Extrinsic[]) {
    this.hash = hash.toString()
    this.number = header.number.toNumber()
    this.parentHash = header.parentHash.toString()
    extrinsics.forEach((ex: Extrinsic) => {
      const tx = new Transaction(ex, hash)
      this.transactions.push(tx)
    })
  }
}
