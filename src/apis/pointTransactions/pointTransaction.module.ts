import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointTransaction } from './entities/pointTransaction.entity';
import { User } from '../users/entities/user.entity';
import { PointTransactionsResolver } from './pointTransaction.resolver';
import { PointTransactionsService } from './pointTransaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PointTransaction, //
      User, //
    ]),
  ],
  providers: [
    PointTransactionsResolver, //
    PointTransactionsService, //
  ],
})
export class PointTransactionsModule {}
