import { Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class AppResolver {
  @Query(() => String)
  status(): string {
    return 'running'
  }
}
