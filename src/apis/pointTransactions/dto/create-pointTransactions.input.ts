import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class CreatePointTransactionInput {
  @Field(() => String)
  impUid: string;

  @Min(0) // 최소값 설정
  @Field(() => Int)
  amount: number;
}

@InputType()
export class CancelPointTransactionInput {
  @Field(() => String)
  impUid: string;
}
