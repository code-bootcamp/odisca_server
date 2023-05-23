import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Payment } from 'src/apis/payments/entities/payment.entity';

@Entity()
@ObjectType()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  seat_id: string;

  @Column()
  @Field(() => String)
  seat_number: string;

  @Column()
  @Field(() => String)
  seat_location: string;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  seat_expiredTime?: string;

  @Column({ default: null })
  @Field(() => Int, { nullable: true })
  seat_remainTime?: number;

  @ManyToOne(() => StudyCafe, (studyCafe) => studyCafe.seats)
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.seat)
  @Field(() => [Payment])
  payment: Payment[];
}
