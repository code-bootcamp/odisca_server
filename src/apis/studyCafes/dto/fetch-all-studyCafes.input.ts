import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FetchAllStudyCafesInput {
  @Field(() => [String])
  studyCafe_city: string[];

  @Field(() => [String])
  studyCafe_district: string[];

  @Field(() => Int)
  page: number;
}
