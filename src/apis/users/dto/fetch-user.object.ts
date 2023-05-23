import { Field, ObjectType } from '@nestjs/graphql';
import { Image } from 'src/apis/images/entities/image.entity';
import { Visit } from 'src/apis/visit/entities/visit.entity';
import { User } from '../entities/user.entity';

@ObjectType()
export class FetchUser {
  @Field(() => User)
  user: User;

  @Field(() => [Visit])
  visits: Visit[];

  @Field(() => [Image])
  images: Image[];
}
