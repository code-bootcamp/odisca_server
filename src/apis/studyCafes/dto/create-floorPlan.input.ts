import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCafeFloorPlanInput {
  @Field(() => String)
  id: string;

  @Field(() => Int)
  floorPlanX: number;

  @Field(() => Int)
  floorPlanY: number;

  @Field(() => Int)
  seatCount: number;
}
