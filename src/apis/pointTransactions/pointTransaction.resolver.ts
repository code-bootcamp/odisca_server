import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PointTransaction } from './entities/pointTransaction.entity';
import { CreatePointTransactionInput } from './dto/create-pointTransactions.input';
import { IContext } from './interfaces/context';
import { PointTransactionsService } from './pointTransaction.service';

@Resolver()
export class PointTransactionsResolver {
  constructor(
    private readonly pointTransactionsService: PointTransactionsService,
  ) {}

  @UseGuards()
  @Mutation(() => PointTransaction)
  createPointTransaction(
    @Args('createPointTransactionInput')
    createPointTransactionInput: CreatePointTransactionInput,
    @Context() context: IContext,
  ): Promise<PointTransaction> {
    const user = context.req.user;
    const impUid = createPointTransactionInput.impUid;
    const amount = createPointTransactionInput.amount;
    return this.pointTransactionsService.create({ impUid, amount, user });
  }
}
