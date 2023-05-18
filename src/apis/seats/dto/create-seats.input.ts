import { Field, InputType } from '@nestjs/graphql';
import { SeatInformationInput } from './create-seats-information.input';

@InputType()
export class CreateSeatsInput {
  @Field(() => [SeatInformationInput])
  seatInformation: SeatInformationInput[];

  @Field(() => String)
  studyCafeId: string;
}
