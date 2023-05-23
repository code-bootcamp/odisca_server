import { Field, ObjectType } from '@nestjs/graphql';
import { Image } from 'src/apis/images/entities/image.entity';
import { Seat } from 'src/apis/seats/entities/seat.entity';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { Column } from 'typeorm';

@ObjectType()
export class FetchReviewPageObject {
  @Column()
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;

  @Column()
  @Field(() => Seat)
  seat: Seat;

  @Column()
  @Field(() => Image)
  image: Image;
}
