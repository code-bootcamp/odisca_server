import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Visit } from 'src/apis/visit/entities/visit.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  review_id: string;

  @Column()
  @Field(() => String)
  review_content: string;

  @CreateDateColumn()
  @Field(() => Date)
  review_createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Visit)
  @Field(() => Visit)
  visit: Visit;
}
