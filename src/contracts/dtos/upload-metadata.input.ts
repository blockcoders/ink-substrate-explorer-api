import { Field, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class UploadMetadataInput {
  @Field(() => String)
  hash!: string

  @Field(() => String)
  metadata!: string 
}
