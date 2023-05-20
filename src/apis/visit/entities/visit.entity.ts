import { Field, ObjectType } from '@nestjs/graphql';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  visit_id: string;

  @CreateDateColumn()
  @Field(() => Date)
  visit_createdAt: Date;

  @OneToOne(() => Review)
  @Field(() => Review)
  visit_review: Review;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => StudyCafe)
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;
}
