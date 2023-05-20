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
    visitId, //
  }): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: { visit_id: visitId },
    });
    return visit;
  }

  async findAllByUserId({
    userId, //
  }): Promise<Visit[]> {
    const user = await this.usersRepository.find({
      where: { user_id: userId },
    });

    const visit = await this.visitRepository.find({
      where: { user: user },
    });
    return visit;
  }
}
