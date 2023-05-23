import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/common/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Image } from '../images/entities/image.entity';
import { CreateCafeFloorPlanInput } from './dto/create-floorPlan.input';
import { CreateStudyCafeInput } from './dto/create-studyCafe.input';
import { FetchAllStudyCafesInput } from './dto/fetch-all-studyCafes.input';
import { StudyCafesWithImages } from './dto/fetch-all-studyCafes.object';
import { FetchOneStudyCafe } from './dto/fetch-one-studyCafe.object';
import { UpdateStudyCafeInput } from './dto/update-studyCafe.input';
import { StudyCafe } from './entities/studyCafe.entity';
import { StudyCafesService } from './studyCafes.service';

@Resolver()
export class StudyCafesResolver {
  constructor(private readonly studyCafesService: StudyCafesService) {}

  // 스터디 카페 등록
  @UseGuards(GqlAuthGuard('administer-access'))
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
  @UseGuards(GqlAuthGuard('administer-access'))
  @Mutation(() => Boolean)
  createLoginCafeFloorPlanAndSeats(
    @Args('createCafeFloorPlanInput')
    createCafeFloorPlanInput: CreateCafeFloorPlanInput,
  ): Promise<boolean> {
    return this.studyCafesService.createCafeFloorPlanAndSeats({
      createCafeFloorPlanInput,
    });
  }

  // 전체 카페 조회 (in 메인 페이지)
  @Query(() => [StudyCafesWithImages])
  fetchAllStudyCafes(
    @Args('fetchAllStudyCafesInput')
    fetchAllStudyCafesInput: FetchAllStudyCafesInput,
  ): Promise<StudyCafesWithImages[]> {
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

  // 등록한 스터디 카페 하나 조회(유저용)
  @Query(() => StudyCafe)
  fetchOneStudyCafeForUser(
    @Args('studyCafe_id') studyCafe_id: string,
  ): Promise<StudyCafe> {
    return this.studyCafesService.fetchStudyCafeByIdForUser({ studyCafe_id });
  }

  // 등록한 스터디 카페 하나 조회(관리자용)
  @UseGuards(GqlAuthGuard('administer-access'))
  @Query(() => StudyCafe)
  fetchOneStudyCafeForAdminister(
    @Args('studyCafe_id') studyCafe_id: string,
  ): Promise<StudyCafe> {
    return this.studyCafesService.fetchStudyCafeByIdForAdmin({ studyCafe_id });
  }

  // 스터디 카페 수정
  @UseGuards(GqlAuthGuard('administer-access'))
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
