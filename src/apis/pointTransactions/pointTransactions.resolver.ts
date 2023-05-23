import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PointTransaction } from './entities/pointTransaction.entity';
import {
  CancelPointTransactionInput,
  CreatePointTransactionInput,
} from './dto/create-pointTransactions.input';
import { IContext } from '../../common/interfaces/context';
import { PointTransactionsService } from './pointTransactions.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
export class PointTransactionsResolver {
  constructor(
    private readonly pointTransactionsService: PointTransactionsService,
  ) {}

  // userId로 모든 포인트 결제내역 찾기
  @Query(() => [PointTransaction])
  fetchLoginPointTransactions(
    @Context() context: IContext,
  ): Promise<PointTransaction[]> {
    const userId = context.req.user;
    return this.pointTransactionsService.findByUserId({ userId });
  }

  // 포인트결제 생성
  @UseGuards(GqlAuthGuard('user-access'))
  @Mutation(() => PointTransaction)
  createLoginPointTransaction(
    @Args('createPointTransactionInput')
    createPointTransactionInput: CreatePointTransactionInput,
    @Context() context: IContext,
  ): Promise<PointTransaction> {
    const user_id = context.req.user.id;
    const pointTransaction_impUid =
      createPointTransactionInput.pointTransaction_impUid;
    const pointTransaction_amount =
      createPointTransactionInput.pointTransaction_amount;
    return this.pointTransactionsService.create({
      pointTransaction_impUid,
      pointTransaction_amount,
      user_id,
    });
  }

  // 포인트 결제 취소
  @UseGuards(GqlAuthGuard('user-access'))
  @Mutation(() => Boolean)
  cancelLoginPointTransaction(
    @Args('cancelPointTransactionInput')
    cancelPointTransactionInput: CancelPointTransactionInput,
    @Context() context: IContext,
  ): Promise<boolean> {
    const user_id = context.req.user.id;
    const pointTransaction_impUid =
      cancelPointTransactionInput.pointTransaction_impUid;
    return this.pointTransactionsService.cancel({
      pointTransaction_impUid,
      user_id,
    });
  }
}
