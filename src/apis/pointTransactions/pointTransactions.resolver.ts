import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
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

  // 포인트결제 생성
  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => PointTransaction)
  createLoginPointTransaction(
    @Args('createPointTransactionInput')
    createPointTransactionInput: CreatePointTransactionInput,
    @Context() context: IContext,
  ): Promise<PointTransaction> {
    const user = context.req.user;
    const impUid = createPointTransactionInput.impUid;
    const amount = createPointTransactionInput.amount;
    console.log(user);
    return this.pointTransactionsService.create({
      impUid,
      amount,
      user,
    });
  }

  // 포인트 결제 취소
  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => PointTransaction)
  cancelLoginPointTransaction(
    @Args('cancelPointTransactionInput')
    cancelPointTransactionInput: CancelPointTransactionInput,
    @Context() context: IContext,
  ): Promise<PointTransaction> {
    const user = context.req.user;
    const impUid = cancelPointTransactionInput.impUid;
    return this.pointTransactionsService.cancel({ impUid, user });
  }
}
