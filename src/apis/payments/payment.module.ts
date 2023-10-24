import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payment.service';
import { PaymentsResolver } from './payment.resolver';
import { Visit } from '../visit/entities/visit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
      Visit, //
    ]),
  ],
  providers: [
    PaymentsResolver, //
    PaymentsService, //
  ],
})
export class PaymentsModule {}
