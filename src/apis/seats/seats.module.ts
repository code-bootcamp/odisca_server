import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { SeatsResolver } from './seats.resolver';
import { SeatsService } from './seats.service';
import { StudyCafe } from '../studyCafes/entities/studyCafe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, StudyCafe])],
  providers: [SeatsResolver, SeatsService],
})
export class SeatsModule {}
