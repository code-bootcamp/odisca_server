import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class CreatePointTransactionInput {
  @Field(() => String)
  pointTransaction_impUid: string;

  @Min(0) // 최소값 설정
  @Field(() => Int)
  pointTransaction_amount: number;
}

@InputType()
export class CancelPointTransactionInput {
  @Field(() => String)
  pointTransaction_impUid: string;
}
