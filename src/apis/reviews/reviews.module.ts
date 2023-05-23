import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Visit } from '../visit/entities/visit.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';
import { VisitService } from '../visit/visit.service';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/entities/image.entity';
import { StudyCafe } from '../studyCafes/entities/studyCafe.entity';
import { StudyCafesService } from '../studyCafes/studyCafes.service';
import { SeatsService } from '../seats/seats.service';
import { Seat } from '../seats/entities/seat.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      User, //
      Visit, //
      Image, //
      StudyCafe, //
      Seat, //
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService, //
    VisitService, //
    ImagesService, //
    StudyCafesService, //
    SeatsService, //
    UsersService, //
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
