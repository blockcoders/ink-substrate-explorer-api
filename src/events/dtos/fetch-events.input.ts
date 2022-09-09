import { Field, Int, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class FetchEventsInput {
  @Field(/* istanbul ignore next */ () => Int, { nullable: true })
  skip? = 0

  @Field(/* istanbul ignore next */ () => Int, { nullable: true })
  take? = 20

  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  contract?: string

  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  transactionHash?: string
}
