import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

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
}
