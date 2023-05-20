import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  POINT_TRANSACTION_STATUS_ENUM,
  PointTransaction,
} from './entities/pointTransaction.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  IPointTransactionsServiceCancel,
  IPointTransactionsServiceCheckDuplication,
  IPointTransactionsServiceCreate,
  IPointTransactionsServiceFindOneByImpUid,
} from './interfaces/pointTransactions-service.interface';
import { IamportService } from '../iamport/iamport.service';

@Injectable()
export class PointTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionsRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,

    private readonly iamportService: IamportService,
  ) {}
  findByUserId({ userId }): Promise<PointTransaction[]> {
    return this.pointTransactionsRepository.find({
      where: { user: userId },
      relations: ['user'],
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////

  findOneByImpUid({
    pointTransaction_impUid,
  }: IPointTransactionsServiceFindOneByImpUid): Promise<PointTransaction> {
    return this.pointTransactionsRepository.findOne({
      where: { pointTransaction_impUid },
    });
  }

  async checkDuplication({
    pointTransaction_impUid,
  }: IPointTransactionsServiceCheckDuplication): Promise<void> {
    const result = await this.findOneByImpUid({ pointTransaction_impUid });
    if (result) throw new ConflictException('이미 등록된 결제 아이디입니다.');
  }

  // 포인트 결제 등록 API
  async create({
    pointTransaction_impUid,
    pointTransaction_amount,
    user_id,
  }: IPointTransactionsServiceCreate): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      await this.iamportService.checkPaid({
        pointTransaction_impUid,
        pointTransaction_amount,
      });
      await this.checkDuplication({ pointTransaction_impUid });

      // PointTransaction 테이블에 거래기록 1줄 생성
      const pointTransaction = this.pointTransactionsRepository.create({
        pointTransaction_impUid,
        pointTransaction_amount,
        user: { user_id },
        pointTransaction_status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT, // 'PAYMENT'
      });

      await queryRunner.manager.save(pointTransaction);

      // 유저 포인트 조회
      const user = await queryRunner.manager.findOne(User, {
        where: { user_id },
        lock: { mode: 'pessimistic_write' },
      });

      // 유저 포인트 업데이트
      const updatedUser = this.usersRepository.create({
        ...user,
        user_point: user.user_point + pointTransaction_amount,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      return pointTransaction;
    } catch (error) {
      // 결제 전 상태로 돌아가기
      await queryRunner.rollbackTransaction();
    } finally {
      // 쿼리러너 연결 해제
      await queryRunner.release();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////

  // 포인트 결제 취소 API
  async cancel({
    pointTransaction_impUid,
    user_id,
  }: IPointTransactionsServiceCancel): Promise<PointTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const pointTransactionCancel = await queryRunner.manager.findOne(
        PointTransaction,
        {
          where: {
            pointTransaction_impUid,
            pointTransaction_status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
          },
          lock: { mode: 'pessimistic_write' },
        },
      );

      const pointTransaction = await queryRunner.manager.findOne(
        PointTransaction,
        {
          where: { pointTransaction_impUid },
          lock: { mode: 'pessimistic_write' },
        },
      );

      if (pointTransactionCancel) {
        throw new UnprocessableEntityException('이미 취소된 내역입니다.');
      } else {
        await this.iamportService.cancel({ pointTransaction_impUid });

        // 유저 포인트 조회
        const user = await queryRunner.manager.findOne(User, {
          where: { user_id },
          lock: { mode: 'pessimistic_write' },
        });

        // 유저 포인트 업데이트
        const updatedUser = this.usersRepository.create({
          ...user,
          user_point:
            user.user_point - pointTransaction.pointTransaction_amount,
        });
        await queryRunner.manager.save(updatedUser);

        const cancelPointTransaction = this.pointTransactionsRepository.create({
          pointTransaction_impUid,
          pointTransaction_amount: -pointTransaction.pointTransaction_amount,
          user: { user_id },
          pointTransaction_status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
        });

        await queryRunner.manager.save(cancelPointTransaction);

        await queryRunner.commitTransaction();

        return cancelPointTransaction;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
