import { InputType, Int, Field } from '@nestjs/graphql'

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
}
