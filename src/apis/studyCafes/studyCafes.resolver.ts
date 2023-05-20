import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/common/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateCafeFloorPlanInput } from './dto/create-floorPlan.input';
import { CreateStudyCafeInput } from './dto/create-studyCafe.input';
import { FetchAllStudyCafesInput } from './dto/fetch-all-studyCafes.input';
import { StudyCafesWithImages } from './dto/fetch-all-studyCafes.object';
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
    const administer_id = context.req.user.id;
    return this.studyCafesService.createStudyCafe({
      createStudyCafeInput,
      administer_id,
    });
  }

  // 스터디 카페 좌석배치도 및 좌석 수 등록
  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => StudyCafe)
  createLoginCafeFloorPlanAndSeats(
    @Args('createCateFloorPlanInput')
    createCafeFloorPlanInput: CreateCafeFloorPlanInput,
  ): Promise<StudyCafe> {
    return this.studyCafesService.createCafeFloorPlanAndSeats({
      createCafeFloorPlanInput,
    });
  }

  // 전체 카페 조회 (in 메인 페이지)
  @Query(() => [StudyCafesWithImages])
  fetchAllStudyCafes(
    @Args('fetchAllStudyCafesInput')
    fetchAllStudyCafesInput: FetchAllStudyCafesInput,
  ): Promise<StudyCafe[]> {
    return this.studyCafesService.fetchAllStudyCafes({
      fetchAllStudyCafesInput,
    });
  }

  // 등록한 스터디 카페 전체 조회
  @Query(() => [StudyCafe])
  fetchAllStudyCafesByAdminId(
    @Args('administer_id') administer_id: string,
  ): Promise<StudyCafe[]> {
    return this.studyCafesService.fetchStudyCafesById({ administer_id });
  }

  // 등록한 스터디 카페 하나 조회
  @Query(() => StudyCafe)
  fetchOneStudyCafe(
    @Args('studyCafe_id') studyCafe_id: string,
  ): Promise<StudyCafe> {
    return this.studyCafesService.fetchStudyCafeById({ studyCafe_id });
  }

  // 스터디 카페 수정
  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => StudyCafe)
  updateLoginStudyCafe(
    @Context() context: IContext,
    @Args('updateStudyCafeInput')
    updateStudyCafeInput: UpdateStudyCafeInput,
  ): Promise<StudyCafe> {
    const administer_id = context.req.user.id;
    return this.studyCafesService.updateStudyCafe({
      updateStudyCafeInput,
      administer_id,
    });
  }
}
