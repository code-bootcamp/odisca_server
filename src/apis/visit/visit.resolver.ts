import { Context, Query, Resolver } from '@nestjs/graphql';
import { VisitService } from './visit.service';
import { Visit } from './entities/visit.entity';
import { IContext } from 'src/common/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
export class VisitResolver {
  constructor(
    private readonly visitService: VisitService, //
  ) {}

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => [Visit])
  async fetchAllLoginVisitByUserId(
    @Context() context: IContext, //
  ): Promise<Visit[]> {
    const user_id = context.req.user.id;
    return await this.visitService.findAllByUserId({
      user_id,
    });
  }
}
