import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateSeatsInput {
  @Field(() => Int)
  number: number;

  @Field(() => String)
  location: string;

  @Field(() => Int)
  seatCount: number;

  @Field(() => String)
  studyCafeId: string;
}
