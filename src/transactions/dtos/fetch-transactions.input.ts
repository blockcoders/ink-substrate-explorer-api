import { Field, Int, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class FetchTransactionsInput {
  @Field(/* istanbul ignore next */ () => Int)
  skip? = 0

  @Field(/* istanbul ignore next */ () => Int)
  take? = 20

  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  blockHash?: string

  @Field(/* istanbul ignore next */ () => Boolean)
  orderAsc?: boolean = false
}
