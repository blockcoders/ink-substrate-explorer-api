import { Field, Int, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class FetchEventsInput {
  @Field(() => Int, { nullable: true })
  skip = 0

  @Field(() => Int, { nullable: true })
  take = 20

  @Field(() => String, { nullable: true })
  contract?: string
}
