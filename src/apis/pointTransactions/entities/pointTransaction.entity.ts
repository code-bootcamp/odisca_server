import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// database용 enum 데이터 타입
export enum POINT_TRANSACTION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}
// graphql enum 데이터 타입
registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
  name: 'POINT_TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  pointTransaction_id: string;

  @Column()
  @Field(() => String)
  pointTransaction_impUid: string;

  @Column()
  @Field(() => Int)
  pointTransaction_amount: number;

  @Column({ type: 'enum', enum: POINT_TRANSACTION_STATUS_ENUM })
  @Field(() => POINT_TRANSACTION_STATUS_ENUM)
  pointTransaction_status: POINT_TRANSACTION_STATUS_ENUM;

  @CreateDateColumn()
  @Field(() => Date)
  pointTransaction_date: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
