import { Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class AppResolver {
  @Query(/* istanbul ignore next */ () => String)
  status(): string {
    return 'running'
  }

  @Query(/* istanbul ignore next */ () => String)
  version(): string {
    return 'v1.0.5'
  }
}
