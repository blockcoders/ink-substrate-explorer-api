import { Field, Int, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class FetchContractsInput {
  @Field(/* istanbul ignore next */ () => Int)
  skip? = 0

  @Field(/* istanbul ignore next */ () => Int)
  take? = 20

}
