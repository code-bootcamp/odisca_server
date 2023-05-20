import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import {
  IReviewServiceFindByUserId,
  IReviewsServiceCancel,
  IReviewsServiceCreate,
  IReviewsServiceUpdate,
} from './interfaces/reviews-service.interface';
import { VisitService } from '../visit/visit.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    private readonly visitService: VisitService,
  ) {}

  // findOneByVisitId({
  //   visit: visitId,
  // }: IReviewsServiceFindOneByVisitId): Promise<Visit> {
  //   return this.visitRepository.findOne({
  //     relations: ['visit'],
  //     where: { id: visitId },
  //   });
  // }

  async findByUserId({
    user, //
  }: IReviewServiceFindByUserId): Promise<Review[]> {
    console.log(user);
    // const checkShop = await this.visitService.findByUserId({ userId });
    // if (!checkShop) {
    //   throw new UnprocessableEntityException('유효하지 않은 가게ID 입니다');
    // }
    // const result = await this.reviewsRepository.find({
    //   where: { shop: { id: shopId } },
    //   skip: (page - 1) * count,
    //   take: count,
    //   order: {
    //     createdAt: 'ASC',
    //   },
    //   relations: ['shop', 'reservation'],
    // });

    return;
  }

  async createReview({
    review_content, //
    user_id, //
    visit_id, //
  }: IReviewsServiceCreate): Promise<Review> {
    try {
      const checkVisit = await this.reviewsRepository.find({
        where: { visit: { visit_id } },
        relations: ['visit'],
      });

      if (checkVisit.length > 0) {
        throw new UnprocessableEntityException(
          '이미 스터디카페의 리뷰를 작성했습니다!',
        );
      }

      const result = await this.reviewsRepository.save({
        review_content,
        user: { user_id },
        visit: { visit_id: visit_id },
      });

      return result;
    } catch (error) {
      throw new UnprocessableEntityException(
        '이미 스터디카페의 리뷰를 작성했습니다!',
      );
    }
  }

  async updateReview({
    review_content, //
    user_id, //
    review_id, //
  }: IReviewsServiceUpdate): Promise<boolean> {
    try {
      // 지금 로그인한 유저가 리뷰를 적은 유저가 맞는지 확인 (아니면 에러 맞으면 수정)
      const checkUser = await this.reviewsRepository.find({
        where: { user: { user_id } },
        relations: ['user'],
      });
      if (checkUser.length > 0) {
        throw new UnprocessableEntityException('내가 쓴 리뷰가 아닙니다!');
      }
      console.log(111, checkUser);

      // 리뷰 수정
      const result = await this.reviewsRepository.update(
        {
          review_id,
        },
        {
          review_content,
        },
      );

      console.log(222, result);

      return result.affected ? true : false;
    } catch (error) {
      throw new UnprocessableEntityException('내가 쓴 리뷰가 아닙니다!');
    }
  }

  async deleteReview({
    user_id, //
    review_id, //
  }: IReviewsServiceCancel): Promise<boolean> {
    try {
      // 지금 로그인한 유저가 리뷰를 적은 유저가 맞는지 확인 (아니면 에러 맞으면 삭제)
      const checkUser = await this.reviewsRepository.find({
        where: { user: { user_id } },
        relations: ['user'],
      });
      console.log(111111, checkUser);
      if (checkUser.length > 0) {
        throw new UnprocessableEntityException('내가 쓴 리뷰가 아닙니다!');
      }

      // 리뷰 삭제
      const result = await this.reviewsRepository.delete({ review_id });

      // return 값이 false면 그 리뷰를 쓴 유저가 지금 로그인한 유저가 아님
      return result.affected ? true : false;
    } catch (error) {
      throw new UnprocessableEntityException('내가 쓴 리뷰가 아닙니다!');
    }
  }
}
