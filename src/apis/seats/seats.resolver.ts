import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateSeatsInput } from './dto/create-seats.input';
import { Seat } from './entities/seat.entity';
import { SeatsService } from './seats.service';

@Resolver()
export class SeatsResolver {
  constructor(private readonly seatsService: SeatsService) {}

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Seat)
  createSeats(@Args('createSeatsInput') createSeatsInput: CreateSeatsInput) {
    return this.seatsService.create({ createSeatsInput });
  }

  @Query(() => [Seat])
  fetchAllSeatsByStudyCafeId(@Args('studyCafeId') studyCafeId: string) {
    return this.seatsService.fetchAllSeatsByStudyCafeId({ studyCafeId });
  }

  // @Mutation(() => Boolean)
  // updateSeatState() {
  //   return this.seatsService.updateSeatState();
  // }
  // @Mutation()
  // updateSeatEveryMinute() {
  //   return this.seatsService.updateSeatEveryMinute();
  // }
}
