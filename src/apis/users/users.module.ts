import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { Review } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { StudyCafe } from '../studyCafes/entities/studyCafe.entity';
import { StudyCafesService } from '../studyCafes/studyCafes.service';
import { Visit } from '../visit/entities/visit.entity';
import { VisitService } from '../visit/visit.service';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Visit, StudyCafe, Image, Review])],
  providers: [
    UsersResolver,
    UsersService,
    VisitService,
    StudyCafesService,
    ImagesService,
    ReviewsService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
