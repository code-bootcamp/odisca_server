import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { IPaymentsServiceCreate } from './interfaces/payment-service.interface';
import { Visit } from '../visit/entities/visit.entity';
import { Seat } from '../seats/entities/seat.entity';
import { StudyCafe } from '../studyCafes/entities/studyCafe.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    private readonly dataSource: DataSource,
  ) {}

  getExpiredTime({ time }) {
    const expiredTime = new Date();

    expiredTime.setUTCHours(expiredTime.getUTCHours() + 9 + time);

    // const ms = expiredTime.getTime();

    return String(expiredTime);
  }

  async createLoginPayment({
    point, //
    time, //
    user: _user, //
    studyCafeId, //
    seatId, //
  }: IPaymentsServiceCreate): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // Seat 테이블 seatId로 조회
      const seat = await queryRunner.manager.findOne(Seat, {
        where: { id: seatId },
        lock: { mode: 'pessimistic_write' },
      });

      // Payment 테이블 저장 (point, user)
      const payment = await this.paymentsRepository.create({
        point,
        time,
        user: _user,
        seat,
      });
      await queryRunner.manager.save(payment);

      // User테이블 _user.id로 조회
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      // User테이블 업데이트 (user포인트 차감)
      user.point -= point;
      await queryRunner.manager.save(user);

      // StudyCafe 테이블 studyCafeId로 조회
      const studyCafe = await queryRunner.manager.findOne(StudyCafe, {
        where: { id: studyCafeId },
        lock: { mode: 'pessimistic_write' },
      });

      // Visit테이블 저장 (user, studyCafe)
      const createVisit = await this.visitRepository.create({
        user: user,
        studyCafe: studyCafe,
      });
      await queryRunner.manager.save(createVisit);

      // expiredTime(종료시간) 구하기
      const expiredTime = await this.getExpiredTime({ time });

      // Seat테이블 업데이트 (user, expiredTime)
      seat.user = user;
      seat.expiredTime = expiredTime;
      console.log(expiredTime);

      await queryRunner.manager.save(seat);

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
