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
  IPointTransactionsServiceCheckAlreadyCanceled,
  IPointTransactionsServiceCheckDuplication,
  IPointTransactionsServiceCheckHasCancelablePoint,
  IPointTransactionsServiceCreate,
  IPointTransactionsServiceCreateForPayment,
  IPointTransactionsServiceFindByImpUidAndUser,
  IPointTransactionsServiceFindOneByImpUid,
} from './interfaces/pointTransaction-service.interface';

@Injectable()
export class PointTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionsRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource, // private readonly iamportService: IamportService,
  ) {}

  findOneByImpUid({
    impUid,
  }: IPointTransactionsServiceFindOneByImpUid): Promise<PointTransaction> {
    return this.pointTransactionsRepository.findOne({ where: { impUid } });
  }

  async checkDuplication({
    impUid,
  }: IPointTransactionsServiceCheckDuplication): Promise<void> {
    const result = await this.findOneByImpUid({ impUid });
    if (result) throw new ConflictException('이미 등록된 결제 아이디입니다.');
  }

  async createForPayment({
    impUid,
    amount,
    user,
  }: IPointTransactionsServiceCreateForPayment): Promise<PointTransaction> {
    // await this.iamportService.checkPaid({ impUid, amount }); // 결제완료 상태인지 검증하기
    await this.checkDuplication({ impUid }); // 이미 결제됐던 id인지 검증하기

    return this.create({ impUid, amount, user });
  }

  async create({
    impUid,
    amount,
    user: _user,
  }: IPointTransactionsServiceCreate): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const pointTransaction = this.pointTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });

      await queryRunner.manager.save(pointTransaction);

      // 유저 조회할 때 다른 사람들이 조회 못하게 lock
      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      // 유저 포인트 업데이트
      const updatedUser = this.usersRepository.create({
        ...user,
        point: user.point + amount,
      });

      await queryRunner.manager.save(updatedUser);

      // 확정(lock 해제)
      await queryRunner.commitTransaction();

      // 최종 결과 리턴
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

  checkAlreadyCanceled({
    pointTransactions,
  }: IPointTransactionsServiceCheckAlreadyCanceled): void {
    const canceledPointTransactions = pointTransactions.filter(
      (el) => el.status === POINT_TRANSACTION_STATUS_ENUM.CANCEL,
    );
    if (canceledPointTransactions.length) {
      throw new ConflictException('이미 취소된 결제 아이디입니다.');
    }
  }

  checkHasCancelablePoint({
    pointTransactions,
  }: IPointTransactionsServiceCheckHasCancelablePoint): void {
    const paidPointTransactions = pointTransactions.filter(
      (el) => el.status === POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    );
    if (!paidPointTransactions.length) {
      throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');
    }
    if (paidPointTransactions[0].user.point < paidPointTransactions[0].amount) {
      throw new UnprocessableEntityException('포인트가 부족합니다.');
    }
  }

  findByImpUidAndUser({
    impUid,
    user,
  }: IPointTransactionsServiceFindByImpUidAndUser): Promise<
    PointTransaction[]
  > {
    return this.pointTransactionsRepository.find({
      where: { impUid, user: { id: user.id } },
      relations: ['user'],
    });
  }

  async cancel({
    impUid,
    user,
  }: IPointTransactionsServiceCancel): Promise<PointTransaction> {
    const pointTransactions = await this.findByImpUidAndUser({ impUid, user }); // 결제내역 조회하기
    this.checkAlreadyCanceled({ pointTransactions }); // 이미 취소된 id인지 검증
    this.checkHasCancelablePoint({ pointTransactions }); // 포인트가 취소하기에 충분히 있는지 검증하기

    // 결제 취소하기
    // const canceledAmount = await this.iamportService.cancel({ impUid });

    // 취소된 결과 등록하기
    return this.create({
      impUid,
      // amount: -canceledAmount,
      amount: 3000, // iamport 연결 후 수정
      user,
      status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
    });
  }
}
