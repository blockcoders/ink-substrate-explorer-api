import { Field, InputType } from '@nestjs/graphql'
import { FrameSystemEventRecord } from '@polkadot/types/lookup'

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

  static fromRecord(record: FrameSystemEventRecord) {
    const {
      event: { section, method, data, index },
      topics,
    } = record
    const [account_id] = data
    const eventInput = new CreateEventInput()
    eventInput.contract = account_id.toString()
    eventInput.index = index.toHex()
    eventInput.section = section
    eventInput.method = method
    eventInput.topics = topics.toString()
    eventInput.data = data.toString()
    return eventInput
  }
}
