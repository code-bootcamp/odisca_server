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
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      User, //
      Visit, //
      Image, //
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService, //
    VisitService, //
    ImagesService, //
    // UsersService,
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
