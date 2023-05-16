import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { DataSource, Repository } from 'typeorm';
// import { Visit } from '../visit/entities/visit.entity';
import {
  IReviewsServiceCreate,
  IReviewsServiceFindOneByVisitId,
  IReviewsServiceUpdate,
} from './interfaces/reviews-service.interface';
import { Visit } from '../visit/entities/visit.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
  ) {}

  findOneByVisitId({
    visit: visitId,
  }: IReviewsServiceFindOneByVisitId): Promise<Visit> {
    return this.visitRepository.findOne({
      relations: ['visit'],
      where: { id: visitId },
    });
  }

  async createReview({
    content, //
    user, //
    visit: visitId, //
  }: IReviewsServiceCreate): Promise<Review> {
    console.log(content, user, visitId);
    try {
      const userId = user.id;

      const result = await this.reviewsRepository.save({
        content,
        user: { id: userId },
        visit: { id: visitId },
      });

      return result;
    } catch (error) {}
  }

  async update({
    content, //
    user, //
    visit: visitId, //
    reviewId, //
  }: IReviewsServiceUpdate): Promise<boolean> {
    try {
      // 지금 로그인한 유저가 리뷰를 적은 유저가 맞는지 확인 (아니면 에러 맞으면 수정)
      const visit = this.findOneByVisitId({
        visit: visitId,
      });

      // 리뷰 수정
      const result = await this.reviewsRepository.update(
        {
          id: reviewId,
        },
        {
          content,
        },
      );

      return result.affected ? true : false;
    } catch (error) {}
  }
}
