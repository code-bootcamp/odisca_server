import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateSeatsInput } from './dto/create-seats.input';
import { Seat } from './entities/seat.entity';
import { SeatsService } from './seats.service';

@Resolver()
export class SeatsResolver {
  constructor(
    private readonly seatsService: SeatsService, //
  ) {}

  // 좌석 등록
  @UseGuards(GqlAuthGuard('administer-access'))
  @Mutation(() => Boolean)
  createSeats(
    @Args('createSeatsInput') createSeatsInput: CreateSeatsInput,
  ): Promise<boolean> {
    return this.seatsService.create({ createSeatsInput });
  }

  // 해당 카페 좌석 조회
  @Query(() => [Seat])
  fetchAllSeatsByStudyCafeId(@Args('studyCafe_id') studyCafe_id: string) {
    return this.seatsService.fetchAllSeatsByStudyCafeId({ studyCafe_id });
  }

  // 선택 좌석 정보 조회
  @Query(() => Seat)
  fetchOneSeatsBySeatId(@Args('seat_id') seat_id: string) {
    return this.seatsService.fetchOneSeatBySeatId({ seat_id });
  }

  // 1분마다 좌석 잔여시간 및 이용여부 업데이트
  @Mutation(() => String)
  updateSeatEveryMinute() {
    return this.seatsService.updateSeatEveryMinute();
  }

  // 1분마다 이용중인 좌석 저장
  @Mutation(() => Boolean)
  countInUseSeat() {
    return this.seatsService.countInUseSeat();
  }
}
