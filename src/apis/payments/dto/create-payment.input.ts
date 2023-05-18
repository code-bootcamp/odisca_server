import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  studyCafeId: string;

  @Min(0)
  @Field(() => Int)
  point: number;

  @Field(() => Int)
  time: number;

  @Field(() => String)
  seatId: string;
}
