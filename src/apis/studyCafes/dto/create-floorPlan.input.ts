import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCafeFloorPlanInput {
  @Field(() => String)
  studyCafe_id: string;

  @Field(() => Int)
  studyCafe_floorPlanX: number;

  @Field(() => Int)
  studyCafe_floorPlanY: number;

  @Field(() => Int)
  studyCafe_seatCount: number;
}
