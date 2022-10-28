import { Field, Int, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class FetchTransactionsByContractInput {
  @Field(/* istanbul ignore next */ () => String)
  address: string | undefined

  @Field(/* istanbul ignore next */ () => Int)
  skip? = 0

  @Field(/* istanbul ignore next */ () => Int)
  take? = 10

  @Field(/* istanbul ignore next */ () => Boolean)
  orderAsc?: boolean = false
}
