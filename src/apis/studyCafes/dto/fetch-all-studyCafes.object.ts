import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Image } from 'src/apis/images/entities/image.entity';

@ObjectType()
export class StudyCafesWithImages {
  @Field(() => String)
  studyCafe_id: string;

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

  @Field(() => Int)
  studyCafe_seatCount: number;

  @Field(() => Int)
  studyCafe_floorPlanX: number;

  @Field(() => Int)
  studyCafe_floorPlanY: number;

  @Field(() => String, { nullable: true })
  image_id: string;

  @Field(() => String, { nullable: true })
  image_url: string;

  @Field(() => Boolean, { nullable: true })
  image_isMain: boolean;
}
