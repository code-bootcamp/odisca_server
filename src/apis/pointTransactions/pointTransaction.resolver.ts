import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PointTransaction } from './entities/pointTransaction.entity';
import {
  CancelPointTransactionInput,
  CreatePointTransactionInput,
} from './dto/create-pointTransactions.input';
import { IContext } from '../../common/interfaces/context';
import { PointTransactionsService } from './pointTransaction.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
export class PointTransactionsResolver {
  constructor(
    private readonly pointTransactionsService: PointTransactionsService,
  ) {}

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => PointTransaction)
  createPointTransaction(
    @Args('createPointTransactionInput')
    createPointTransactionInput: CreatePointTransactionInput,
    @Context() context: IContext,
  ): Promise<PointTransaction> {
    const user = context.req.user;
    const impUid = createPointTransactionInput.impUid;
    const amount = createPointTransactionInput.amount;
    return this.pointTransactionsService.createForPayment({
      impUid,
      amount,
      user,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  cancelPointTransaction(
    @Args('cancelPointTransactionInput')
    cancelPointTransactionInput: CancelPointTransactionInput,
    @Context() context: IContext,
  ) {
    const user = context.req.user;
    const impUid = cancelPointTransactionInput.impUid;
    this.pointTransactionsService.cancel({ impUid, user });
  }
}
