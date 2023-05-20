import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { CreateImageInput } from 'src/apis/images/dto/create-image.input';

@InputType()
export class UpdateStudyCafeInput {
  @Field(() => String, { nullable: true })
  studyCafe_name?: string;

  @Field(() => String, { nullable: true })
  studyCafe_address?: string;

  @Field(() => String, { nullable: true })
  studyCafe_addressDetail?: string;

  @Field(() => String, { nullable: true })
  studyCafe_city?: string;

  @Field(() => String, { nullable: true })
  studyCafe_district?: string;

  @Field(() => String, { nullable: true })
  studyCafe_contact?: string;

  @Field(() => Int, { nullable: true })
  studyCafe_timeFee?: number;

  @Field(() => String, { nullable: true })
  studyCafe_description?: string;

  @Field(() => String, { nullable: true })
  studyCafe_openTime?: string;

  @Field(() => String, { nullable: true })
  studyCafe_closeTime?: string;

  @Field(() => Float, { nullable: true })
  studyCafe_lat?: number;

  @Field(() => Float, { nullable: true })
  studyCafe_lon?: number;

  @Field(() => String, { nullable: true })
  studyCafe_brn?: string;

  @Field(() => [CreateImageInput], { nullable: true })
  image?: CreateImageInput[];
}
