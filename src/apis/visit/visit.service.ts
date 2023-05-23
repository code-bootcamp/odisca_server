import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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
    const user = await this.usersRepository.find({
      where: { user_id },
    });

    const visit = await this.visitRepository.find({
      where: { user: user },
      relations: ['studyCafe'],
      order: {
        visit_createdAt: 'DESC',
      },
      take: pageSize,
      skip: pageSize * (page - 1),
    });
    return visit;
  }

  async create({
    user, //
    studyCafe, //
  }): Promise<Visit> {
    const visit = await this.visitRepository.create({
      user,
      studyCafe,
    });
    return await this.visitRepository.save({ ...visit });
  }
}
