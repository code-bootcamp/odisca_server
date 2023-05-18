import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyCafesService } from '../studyCafes/studyCafes.service';
import { Seat } from './entities/seat.entity';
import { ISeatsServiceCreate } from './interfaces/seats-service.interface';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatsRepository: Repository<Seat>,
    private readonly studyCafesService: StudyCafesService,
  ) {}

  // 좌석 등록
  async create({ createSeatsInput }: ISeatsServiceCreate) {
    const { studyCafeId, seatCount, number, location } = createSeatsInput;
    await this.studyCafesService.updateStudyCafeSeats({
      studyCafeId,
      seatCount,
    });
    for (let i = 0; i < seatCount; i++) {
      this.seatsRepository.save({
        location,
        studyCafe: {
          id: studyCafeId,
        },
      });
    }
  }
}
