import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  // 종료시간 구하기
  getExpiredTime({ payment_time }) {
    const expiredTime = new Date();

    expiredTime.setUTCHours(expiredTime.getUTCHours() + 9 + payment_time);

    const expiredTimeMs = expiredTime.getTime();

    return String(expiredTimeMs);
  }

  // 좌석 결제내역 저장
  async createLoginPayment({
    payment_point, //
    payment_time, //
    user_id, //
    studyCafe_id, //
    seat_id, //
  }: IPaymentsServiceCreate): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // Seat 테이블 seatId로 조회
      const seat = await queryRunner.manager.findOne(Seat, {
        where: { seat_id },
        lock: { mode: 'pessimistic_write' },
      });

      // User테이블 _user.id로 조회
      const user = await queryRunner.manager.findOne(User, {
        where: { user_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (user.user_point < payment_point) {
        throw new UnprocessableEntityException('포인트가 부족합니다!');
      }

      // User테이블 업데이트 (user포인트 차감)
      user.user_point -= payment_point;
      await queryRunner.manager.save(user);

      // StudyCafe 테이블 studyCafeId로 조회
      const studyCafe = await queryRunner.manager.findOne(StudyCafe, {
        where: { studyCafe_id },
        lock: { mode: 'pessimistic_write' },
      });

      // Payment 테이블 저장 (point, user)
      const payment = await this.paymentsRepository.create({
        payment_point,
        payment_time,
        user: user,
        seat: seat,
      });
      await queryRunner.manager.save(payment);

      // Visit테이블 저장 (user, studyCafe)
      const createVisit = await this.visitRepository.create({
        user: user,
        studyCafe: studyCafe,
      });
      await queryRunner.manager.save(createVisit);

      // expiredTime(종료시간) 구하기
      const expiredTimeMs = await this.getExpiredTime({ payment_time });

      const expiredTimeString = String(new Date(Number(expiredTimeMs)));

      // remainTime남은 시간 구하기
      const now = new Date().setUTCHours(new Date().getUTCHours() + 9);
      const remainTime = Number(expiredTimeMs) - now;

      // Seat테이블 업데이트 (user, expiredTime)
      seat.user = user;
      seat.seat_expiredTime = expiredTimeString;
      seat.seat_remainTime = remainTime;

      await queryRunner.manager.save(seat);

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      // 결제 전 상태로 돌아가기
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      // 쿼리러너 연결 해제
      await queryRunner.release();
    }
  }
}
