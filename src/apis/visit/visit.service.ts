import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IVisitServiceCreate } from './interfaces/visit-service.interface';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
  ) {}

  async findByVisitId({
    visitId, //
  }): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: { id: visitId },
    });
    return visit;
  }

  async create({
    user: userId, //
    studyCafe: studyCafeId,
  }: IVisitServiceCreate): Promise<Visit> {
    const visit = await this.visitRepository.save({
      user: { id: userId },
      studyCafe: { id: studyCafeId },
    });
    return visit;
  }
}
