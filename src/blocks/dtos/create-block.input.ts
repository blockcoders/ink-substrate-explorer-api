import { InputType, Int, Field } from '@nestjs/graphql'
import { Header } from '@polkadot/types/interfaces'

@InputType()
export class CreateBlockInput {
  @Field(() => String, { description: 'Block hash' })
  hash!: string

  @Field(() => String, { description: 'Hash of the previous block' })
  parentHash!: string

  @Field(() => Int, { description: 'Block number' })
  number!: number

  // @Field(() => [Transaction], { description: 'List of transactions corresponding to this block' })
  //transactions: string[] = []

  static fromHeader(header: Header): CreateBlockInput {
    const { hash, parentHash, number } = header || {}
    const blockInput = new CreateBlockInput()
    blockInput.hash = hash.toString()
    blockInput.parentHash = parentHash.toString()
    blockInput.number = parseInt(number.toHex())
    return blockInput
  }
}
