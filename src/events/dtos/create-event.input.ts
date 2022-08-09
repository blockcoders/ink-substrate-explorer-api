import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateEventInput {
  @Field(() => String, { description: 'Contract address from which the event was emitted' })
  contract!: string

  @Field(() => String)
  index!: string

  @Field(() => String)
  section!: string

  @Field(() => String)
  method!: string

  @Field(() => String)
  topics!: string

  @Field(() => String)
  data!: string
}
