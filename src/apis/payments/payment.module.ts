import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payment.service';
import { PaymentsResolver } from './payment.resolver';
import { UsersModule } from '../users/users.module';
import { VisitModule } from '../visit/visit.module';

@Module({
  imports: [
    UsersModule,
    VisitModule,
    TypeOrmModule.forFeature([
      Payment, //
    ]),
  ],
  providers: [
    PaymentsResolver, //
    PaymentsService, //
  ],
})
export class PaymentsModule {}
