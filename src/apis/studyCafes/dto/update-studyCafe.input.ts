import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateStudyCafeInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  contact: string;

  @Field(() => Int)
  timeFee: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  operatingTime: string;

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lon: number;

  @Field(() => String)
  brn: string;

  @Field(() => String)
  studyCafeId: string;
}
