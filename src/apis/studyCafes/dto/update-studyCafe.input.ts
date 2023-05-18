import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { CreateImageInput } from 'src/apis/images/dto/create-image.input';

@InputType()
export class UpdateStudyCafeInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  contact?: string;

  @Field(() => Int, { nullable: true })
  timeFee?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  openTime?: string;

  @Field(() => String, { nullable: true })
  closeTime?: string;

  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  lon?: number;

  @Field(() => String, { nullable: true })
  brn?: string;

  @Field(() => [CreateImageInput], { nullable: true })
  image?: CreateImageInput[];
}
