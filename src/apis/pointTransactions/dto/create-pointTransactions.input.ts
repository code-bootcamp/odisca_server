import { Field, InputType, Int } from '@nestjs/graphql';
import { POINT_TRANSACTION_STATUS_ENUM } from '../entities/pointTransaction.entity';
import { Min } from 'class-validator';

@InputType()
export class CreatePointTransactionInput {
  @Field(() => String)
  impUid: string;

  @Min(0) // 최소값 설정
  @Field(() => Int)
  amount: number;
}
