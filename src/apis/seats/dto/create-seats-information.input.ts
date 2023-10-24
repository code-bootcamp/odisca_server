import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SeatInformationInput {
  @Field(() => [[Int]])
  seat: [number][];

  @Field(() => String)
  seat_number: string;
}
