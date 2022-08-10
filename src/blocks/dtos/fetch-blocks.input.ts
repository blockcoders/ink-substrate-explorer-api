import { Field, Int, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class FetchBlocksInput {
  @Field(() => Int)
  skip = 0

  @Field(() => Int)
  take = 10
}
