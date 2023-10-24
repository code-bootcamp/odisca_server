import { Field, ObjectType } from '@nestjs/graphql';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Visit } from 'src/apis/visit/entities/visit.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  review_id: string;

  @Column()
  @Field(() => String, { nullable: true })
  review_content: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  review_createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => StudyCafe, (studyCafe) => studyCafe.review)
  @Field(() => StudyCafe, { nullable: true })
  studyCafe: StudyCafe;

  @JoinColumn()
  @OneToOne(() => Visit)
  @Field(() => Visit, { nullable: true })
  visit?: Visit;
}
