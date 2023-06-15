import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Seat } from 'src/apis/seats/entities/seat.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  payment_id: string;

  @Column()
  @Field(() => Int)
  payment_point: number;

  @Column({ default: 0 })
  @Field(() => Int)
  payment_time: number;

  @CreateDateColumn()
  @Field(() => Date)
  payment_createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Seat, (seat) => seat.payment)
  @Field(() => Seat)
  seat: Seat;
}
