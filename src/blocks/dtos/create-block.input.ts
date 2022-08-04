import { InputType, Int, Field } from '@nestjs/graphql'
import Transaction from '../../transactions/transaction.entity'

@InputType()
export class CreateBlockInput {
  @Field(() => String, { description: 'Block hash' })
  hash: string

  @Field(() => String, { description: 'Hash of the previous block' })
  parentHash: string

  @Field(() => Int, { description: 'Block number' })
  number: number

  @Field(() => [Transaction], { description: 'List of transactions corresponding to this block' })
  transactions: Transaction[] = []

  constructor(hash: string, parentHash: string, number: number, transactions: Transaction[]) {
    this.hash = hash
    this.parentHash = parentHash
    this.number = number
    this.transactions = transactions
  }
}
