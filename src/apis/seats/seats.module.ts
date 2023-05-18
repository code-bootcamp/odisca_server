import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { SeatsResolver } from './seats.resolver';
import { SeatsService } from './seats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seat])],
  providers: [SeatsResolver, SeatsService],
})
export class SeatsModule {}
