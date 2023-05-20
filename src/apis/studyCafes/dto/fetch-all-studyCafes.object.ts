import { Field, ObjectType } from '@nestjs/graphql';
import { Image } from 'src/apis/images/entities/image.entity';
import { StudyCafe } from '../entities/studyCafe.entity';

@ObjectType()
export class StudyCafesWithImages {
  @Field(() => [StudyCafe])
  studyCafes: StudyCafe[];

  @Field(() => [Image])
  images: Image[];
}
