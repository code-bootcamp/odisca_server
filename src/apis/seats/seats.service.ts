import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';
import { ISeatsServiceCreate } from './interfaces/seats-service.interface';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatsRepository: Repository<Seat>,
  ) {}

  // 좌석 등록
  async create({ createSeatsInput }: ISeatsServiceCreate) {
    const { studyCafeId, seatInformation } = createSeatsInput;
    for (let i = 0; i < seatInformation.length; i++) {
      await this.seatsRepository.save({
        location: JSON.stringify(seatInformation[i].seat),
        number: seatInformation[i].number,
        studyCafe: {
          id: studyCafeId,
        },
      });
    }
    return;
  }

  // 해당 카페 좌석 조회
  fetchAllSeatsByStudyCafeId({ studyCafeId }) {
    return this.seatsRepository.find({
      where: { studyCafe: { id: studyCafeId } },
      relations: ['studyCafe', 'user'],
    });
  }

  // 1분마다 좌석 잔여시간 및 이용여부 업데이트
  async updateSeatEveryMinute() {
    const result = await this.seatsRepository.find();
    const now = new Date().setUTCHours(new Date().getUTCHours() + 9);
    try {
      for (let i = 0; i < result.length; i++) {
        if (result[i].user !== null) {
          if (result[i].remainTime <= 0) {
            await this.seatsRepository.update(
              { id: result[i].id },
              { expiredTime: null },
            );
            await this.seatsRepository.update(
              { id: result[i].id },
              { remainTime: null },
            );
            await this.seatsRepository.update(
              { id: result[i].id },
              { user: null },
            );
          } else {
            await this.seatsRepository.update(
              { id: result[i].id },
              {
                remainTime:
                  Number(new Date(result[i].expiredTime).getTime()) - now,
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
}
