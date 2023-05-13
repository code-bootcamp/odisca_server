import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  POINT_TRANSACTION_STATUS_ENUM,
  PointTransaction,
} from './entities/pointTransaction.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { IPointTransactionsServiceCreate } from './interfaces/pointTransaction-service.interface';

@Injectable()
export class PointTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionsRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async create({
    impUid,
    amount,
    user: _user,
  }: IPointTransactionsServiceCreate): Promise<any> {
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction('SERIALIZABLE');

    // try {
    const pointTransaction = this.pointTransactionsRepository.create({
      impUid,
      amount,
      user: _user,
      status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    });

    //   await queryRunner.manager.save(pointTransaction);

    //   // 유저 조회할 때 다른 사람들이 조회 못하게 lock
    //   const user = await queryRunner.manager.findOne(User, {
    //     where: { id: _user.id },
    //     lock: { mode: 'pessimistic_write' },
    //   });

    //   // 유저 포인트 업데이트
    //   const updatedUser = this.usersRepository.create({
    //     ...user,
    //     point: user.point + amount,
    //   });

    //   await queryRunner.manager.save(updatedUser);

    //   // 확정(lock 해제)
    //   await queryRunner.commitTransaction();

    //   // 최종 결과 리턴
    //   return pointTransaction;
    return this.pointTransactionsRepository.save({
      impUid,
      amount,
      user: _user,
      status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    });
    //   })
    // } catch (error) {
    // 결제 전 상태로 돌아가기
    //   await queryRunner.rollbackTransaction();
    // } finally {
    // 쿼리러너 연결 해제
    //   await queryRunner.release();
    // }
  }
}
