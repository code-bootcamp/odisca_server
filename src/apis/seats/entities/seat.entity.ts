import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { User } from 'src/apis/users/entities/user.entity';

@Entity()
@ObjectType()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  number: string;

  @Column()
  @Field(() => String)
  location: string;

  @Column({ default: null })
  @Field(() => Int, { nullable: true })
  expiredTime?: number;

  @ManyToOne(() => StudyCafe)
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
