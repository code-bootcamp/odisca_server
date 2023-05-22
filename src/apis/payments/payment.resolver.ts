import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PaymentsService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreatePaymentInput } from './dto/create-payment.input';
import { IContext } from 'src/common/interfaces/context';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService, //
  ) {}

  // 좌석 결제내역 추가
  @UseGuards(GqlAuthGuard('user-access'))
  @Mutation(() => Payment)
  createLoginPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
    @Context() context: IContext,
  ): Promise<Payment> {
    const user_id = context.req.user.id;
    const payment_point = createPaymentInput.payment_point;
    const studyCafe_id = createPaymentInput.studyCafe_id;
    const seat_id = createPaymentInput.seat_id;
    const payment_time = createPaymentInput.payment_time;
    return this.paymentsService.createLoginPayment({
      payment_point,
      payment_time,
      user_id,
      studyCafe_id,
      seat_id,
    });
  }
}
