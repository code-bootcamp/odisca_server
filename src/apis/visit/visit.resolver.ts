import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
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

  // UserId로 모든 Visit 기록 조회
  @UseGuards(GqlAuthGuard('user-access'))
  @Query(() => [Visit])
  async fetchAllLoginVisitByUserId(
    @Context() context: IContext, //
    @Args({ name: 'page', type: () => Int }) page: number,
  ): Promise<Visit[]> {
    const user_id = context.req.user.id;
    return await this.visitService.findAllByUserId({
      user_id,
      page,
    });
  }
}
