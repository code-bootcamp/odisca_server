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
    visitId,
  }: IReviewsServiceFindOneByVisitId): Promise<Visit> {
    return this.visitRepository.findOne({
      relations: ['visit'],
      where: { id: visitId },
    });
  }

  async create({
    content, //
    user, //
    visitId, //
  }: IReviewsServiceCreate): Promise<Review> {
    try {
      const visit = await this.findOneByVisitId({
        visitId,
      });

      // 방문기록이 존재하면 저장 진행
      if (visit) {
        const review = await this.reviewsRepository.create({
          content,
          user,
        });

        const result = await this.reviewsRepository.save(review);

        return result;
      } else {
        // 방문기록이 존재하지 않으면 에러 던지기
        throw new UnprocessableEntityException(
          '방문기록이 없으므로 리뷰 작성이 불가능합니다.',
        );
      }
    } catch (error) {}
  }

  async update({
    content, //
    user, //
    visitId, //
    reviewId, //
  }: IReviewsServiceUpdate): Promise<boolean> {
    try {
      // 지금 로그인한 유저가 리뷰를 적은 유저가 맞는지 확인 (아니면 에러 맞으면 수정)
      const visit = this.findOneByVisitId({
        visitId,
      });

      let result;

      if ((await visit).user === user) {
        // 리뷰 수정
        result = await this.reviewsRepository.update(
          {
            id: reviewId,
          },
          {
            content,
          },
        );
      }
      return result.affected ? true : false;
    } catch (error) {}
  }
}
