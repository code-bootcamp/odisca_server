import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { Seat } from 'src/apis/seats/entities/seat.entity';

@ObjectType()
export class CreatePaymentReturn {
  @Column()
  @Field(() => Payment)
  payment: Payment;

  @Column()
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;

  @Column()
  @Field(() => Seat)
  seat: Seat;
}
