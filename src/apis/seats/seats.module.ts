import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { StudyCafe } from '../studyCafes/entities/studyCafe.entity';
import { StudyCafesService } from '../studyCafes/studyCafes.service';
import { Seat } from './entities/seat.entity';
import { SeatsResolver } from './seats.resolver';
import { SeatsService } from './seats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, StudyCafe, Image])],
  providers: [SeatsResolver, SeatsService, StudyCafesService, ImagesService],
})
export class SeatsModule {}
