import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { Review } from '../reviews/entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Visit } from '../visit/entities/visit.entity';
import { VisitService } from '../visit/visit.service';
import { StudyCafe } from './entities/studyCafe.entity';
import { StudyCafesResolver } from './studyCafes.resolver';
import { StudyCafesService } from './studyCafes.service';
import { Seat } from '../seats/entities/seat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyCafe, //
      Image, //
      Visit, //
      User, //
      Review, //
      Seat, //
    ]),
  ],
  // controllers: [],
  providers: [
    StudyCafesResolver, //
    StudyCafesService, //
    ImagesService, //
    VisitService, //
  ],
})
export class StudyCafesModule {}
