import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/common/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateCafeFloorPlanInput } from './dto/create-floorPlan.input';
import { CreateStudyCafeInput } from './dto/create-studyCafe.input';
import { UpdateStudyCafeInput } from './dto/update-studyCafe.input';
import { StudyCafe } from './entities/studyCafe.entity';
import { StudyCafesService } from './studyCafes.service';

@Resolver()
export class StudyCafesResolver {
  constructor(private readonly studyCafesService: StudyCafesService) {}

  // 스터디 카페 등록
  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => StudyCafe)
  createLoginStudyCafe(
    @Context() context: IContext,
    @Args('createStudyCafeInput') createStudyCafeInput: CreateStudyCafeInput,
  ): Promise<StudyCafe> {
    const adminId = context.req.user.id;
    return this.studyCafesService.createStudyCafe({
      createStudyCafeInput,
      adminId,
    });
  }

  // 스터디 카페 좌석배치도 등록
  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => StudyCafe)
  createLoginCafeFloorPlan(
    @Context() context: IContext,
    @Args('createCateFloorPlanInput')
    createCafeFloorPlanInput: CreateCafeFloorPlanInput,
  ): Promise<StudyCafe> {
    return this.studyCafesService.createCafeFloorPlan({
      createCafeFloorPlanInput,
    });
  }

  // 등록한 스터디 카페 전체 조회
  @UseGuards(GqlAuthGuard('access'))
  @Query(() => [StudyCafe])
  fetchLoginStudyCafes(@Context() context: IContext): Promise<StudyCafe[]> {
    const adminId = context.req.user.id;
    return this.studyCafesService.fetchStudyCafesById({ adminId });
  }

  // 등록한 스터디 카페 하나 조회
  @UseGuards(GqlAuthGuard('access'))
  @Query(() => StudyCafe)
  fetchLoginStudyCafe(
    @Context() context: IContext,
    @Args('studyCafeId') studyCafeId: string,
  ): Promise<StudyCafe> {
    return this.studyCafesService.fetchStudyCafeById({ studyCafeId });
  }

  // 스터디 카페 수정
  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => StudyCafe)
  updateLoginStudyCafe(
    @Context() context: IContext,
    @Args('updateStudyCafeInput')
    updateStudyCafeInput: UpdateStudyCafeInput,
  ): Promise<StudyCafe> {
    const adminId = context.req.user.id;
    return this.studyCafesService.update({
      updateStudyCafeInput,
      adminId,
    });
  }
}
