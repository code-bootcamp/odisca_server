import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>, //
  ) {}

  // visit테이블에 visit_id로 조회
  async findByVisitId({
    visit_id, //
  }): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: { visit_id: visit_id },
      relations: ['user', 'studyCafe'],
    });
    return visit;
  }

  // 유저 ID로 전체 방문 기록 조회
  async findAllByUserId({
    page,
    user_id, //
  }): Promise<Visit[]> {
    const pageSize = 10;

    const visit = await this.visitRepository.find({
      where: { user: { user_id } },
      relations: [
        'studyCafe',
        'user',
        'studyCafe.images',
        'studyCafe.seats',
        'studyCafe.seats.payment',
      ],
      order: {
        visit_createdAt: 'DESC',
      },
      take: pageSize,
      skip: pageSize * (page - 1),
    });
    return visit;
  }
}
