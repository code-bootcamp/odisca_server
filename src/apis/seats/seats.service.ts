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

  // async updateSeatState() {
  //   console.log('있다가..');
  // }
  // // 1분마다 좌석 상태 업데이트
  // async updateSeatEveryMinute(){
  //   await this.seatsRepository.find({where:{}})
  // }
}
