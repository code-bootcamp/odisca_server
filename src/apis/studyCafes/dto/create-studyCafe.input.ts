import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { CreateImageInput } from 'src/apis/images/dto/create-image.input';

@InputType()
export class CreateStudyCafeInput {
  @Field(() => String)
  studyCafe_name: string;

  @Field(() => String)
  studyCafe_address: string;

  @Field(() => String)
  studyCafe_addressDetail: string;

  @Field(() => String)
  studyCafe_city: string;

  @Field(() => String)
  studyCafe_district: string;

  @Field(() => String)
  studyCafe_contact: string;

  @Field(() => Int)
  studyCafe_timeFee: number;

  @Field(() => String)
  studyCafe_description: string;

  @Field(() => String)
  studyCafe_openTime: string;

  @Field(() => String)
  studyCafe_closeTime: string;

  @Field(() => Float)
  studyCafe_lat: number;

  @Field(() => Float)
  studyCafe_lon: number;

  @Field(() => String)
  studyCafe_brn: string;

  @Field(() => [CreateImageInput])
  image: CreateImageInput[];
}
