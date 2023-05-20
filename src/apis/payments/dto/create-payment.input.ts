import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  studyCafe_id: string;

  @Min(0)
  @Field(() => Int)
  payment_point: number;

  @Field(() => Int)
  payment_time: number;

  @Field(() => String)
  seat_id: string;
}
