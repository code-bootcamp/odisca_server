import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Visit } from '../visit/entities/visit.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';
import { StudyCafe } from '../studyCafes/entities/studyCafe.entity';
import { VisitService } from '../visit/visit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      User, //
      Visit, //
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService, //
    VisitService, //
  ],
})
export class ReviewsModule {}
