import { Field, ObjectType } from '@nestjs/graphql';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => StudyCafe)
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;
}
