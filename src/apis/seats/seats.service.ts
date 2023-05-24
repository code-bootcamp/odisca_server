import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';
import {
  ICountInUseSeat,
  ISeatsServiceCreate,
} from './interfaces/seats-service.interface';
import { StudyCafe } from '../studyCafes/entities/studyCafe.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatsRepository: Repository<Seat>,

    @InjectRepository(StudyCafe)
    private readonly studyCafesRepository: Repository<StudyCafe>,
  ) {}

  // 좌석 등록
  async create({ createSeatsInput }: ISeatsServiceCreate): Promise<boolean> {
    const { studyCafe_id, seatInformation } = createSeatsInput;
    try {
      for (let i = 0; i < seatInformation.length; i++) {
        await this.seatsRepository.save({
          seat_location: JSON.stringify(seatInformation[i].seat),
          seat_number: seatInformation[i].seat_number,
          studyCafe: {
            studyCafe_id,
          },
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  // 해당 카페 좌석 조회
  fetchAllSeatsByStudyCafeId({ studyCafe_id }) {
    return this.seatsRepository.find({
      where: { studyCafe: { studyCafe_id } },
      relations: ['studyCafe', 'user'],
    });
  }

  // 선택 좌석 조회
  fetchOneSeatBySeatId({ seat_id }) {
    return this.seatsRepository.findOne({
      where: { seat_id },
      relations: ['studyCafe', 'user'],
    });
  }

  // studyCafe_id로 좌석 정보 불러오기
  fetchOneSeatByStudyCafeId({ studyCafe_id }) {
    return this.seatsRepository.findOne({
      where: { studyCafe: { studyCafe_id } },
      relations: ['studyCafe'],
    });
  }

  // 1분마다 좌석 잔여시간 및 이용여부 업데이트
  @Cron('* * * * *')
  async updateSeatEveryMinute() {
    const result = await this.seatsRepository.find();
    const now = new Date().setUTCHours(new Date().getUTCHours() + 9);
    try {
      for (let i = 0; i < result.length; i++) {
        if (result[i].user !== null) {
          if (result[i].seat_remainTime <= 0) {
            await this.seatsRepository.update(
              { seat_id: result[i].seat_id },
              { seat_expiredTime: null },
            );
            await this.seatsRepository.update(
              { seat_id: result[i].seat_id },
              { seat_remainTime: null },
            );
            await this.seatsRepository.update(
              { seat_id: result[i].seat_id },
              { user: null },
            );
          } else {
            await this.seatsRepository.update(
              { seat_id: result[i].seat_id },
              {
                seat_remainTime:
                  Number(new Date(result[i].seat_expiredTime).getTime()) - now,
              },
            );
          }
        }
      }
    } catch {
      return '업데이트 실패';
    }
    return '업데이트 완료';
  }

  // 이용중인 좌석 저장
  async countInUseSeat(): Promise<boolean> {
    // 스터디카페 테이블에 모든 정보 조회
    const studyCafe = await this.studyCafesRepository.find();

    let InUseSeats;
    let studyCafeUpdate;
    for (let i = 0; i < studyCafe.length; i++) {
      // 사용중인 스터디카페 배열로 조회
      InUseSeats = await this.seatsRepository.find({
        where: {
          studyCafe: { studyCafe_id: studyCafe[i].studyCafe_id },
          user: { user_id: Not(IsNull()) },
        },
        relations: ['studyCafe', 'user'],
      });

      // 스터디카페 테이블에 inUseSeat 업데이트
      studyCafeUpdate = await this.studyCafesRepository.update(
        {
          studyCafe_id: studyCafe[i].studyCafe_id,
        },
        {
          studyCafe_inUseSeat: InUseSeats.length,
        },
      );
    }

    return studyCafeUpdate.affected ? true : false;
  }
}
