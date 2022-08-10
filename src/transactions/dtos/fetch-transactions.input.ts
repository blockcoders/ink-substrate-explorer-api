import { Field, Int, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class FetchTransactionsInput {
  @Field(() => Int)
  skip = 0

  @Field(() => Int)
  take = 20

  @Field(() => String, { nullable: true })
  blockHash?: string
}
