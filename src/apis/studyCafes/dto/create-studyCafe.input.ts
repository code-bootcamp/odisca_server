import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { CreateImageInput } from 'src/apis/images/dto/create-image.input';

@InputType()
export class CreateStudyCafeInput {
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
  openTime: string;

  @Field(() => String)
  closeTime: string;

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lon: number;

  @Field(() => String)
  brn: string;

  @Field(() => [CreateImageInput])
  image: CreateImageInput[];
}
