import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { IPaymentsServiceCreate } from './interfaces/payment-service.interface';
import { Visit } from '../visit/entities/visit.entity';
import { VisitService } from '../visit/visit.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Visit)
    private readonly visitService: VisitService,

    private readonly dataSource: DataSource,
  ) {}

  async createLoginPayment({
    point, //
    user: _user, //
    studyCafeId, //
  }: IPaymentsServiceCreate): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const payment = this.paymentsRepository.create({
        point,
        user: _user,
      });
      await queryRunner.manager.save(payment);

      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      const updatedUser = this.usersRepository.create({
        ...user,
        point: user.point - point,
      });
      await queryRunner.manager.save(updatedUser);

      const createVisit = this.visitService.create({
        user: _user.id,
        studyCafe: studyCafeId,
      });
      await queryRunner.manager.save(createVisit);

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      // 결제 전 상태로 돌아가기
      await queryRunner.rollbackTransaction();
    } finally {
      // 쿼리러너 연결 해제
      await queryRunner.release();
    }
  }
}
