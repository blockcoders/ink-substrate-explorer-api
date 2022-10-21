import { Field, ArgsType, InputType } from '@nestjs/graphql'

@InputType()
export class QueryOptions {
  @Field(/* istanbul ignore next */ () => String)
  gasLimit?: string

  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  storageLimit?: string

  @Field(/* istanbul ignore next */ () => String, { nullable: true })
  value?: string
}

@InputType()
export class QueryArgs {
  @Field(/* istanbul ignore next */ () => String)
  sender!: string

  @Field(/* istanbul ignore next */ () => QueryOptions)
  options?: QueryOptions

  @Field(/* istanbul ignore next */ () => [String])
  values?: string[] = []
}

@ArgsType()
export class ExecuteQueryInput {
  @Field(/* istanbul ignore next */ () => String)
  address!: string

  @Field(/* istanbul ignore next */ () => String)
  method!: string

  @Field(/* istanbul ignore next */ () => QueryArgs)
  args?: QueryArgs = { sender: '', options: {}, values: [] }
}
