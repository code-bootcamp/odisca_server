import { Field, ObjectType } from '@nestjs/graphql';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { Column } from 'typeorm';
import { StudyCafe } from '../entities/studyCafe.entity';

@ObjectType()
export class FetchOneStudyCafe {
  @Column()
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;

  @Column()
  @Field(() => [Review])
  review: Review[];
}
