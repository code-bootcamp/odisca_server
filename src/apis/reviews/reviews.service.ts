import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import {
  IReviewsServiceFindByUserId,
  IReviewsServiceCancel,
  IReviewsServiceCreate,
  IReviewsServiceUpdate,
  IReviewsServiceFindOneByVisitId,
} from './interfaces/reviews-service.interface';
import { VisitService } from '../visit/visit.service';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/entities/image.entity';
import { StudyCafesService } from '../studyCafes/studyCafes.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    private readonly visitService: VisitService,

    private readonly imagesService: ImagesService,

    private readonly studyCafesService: StudyCafesService,
  ) {}

  async findImageByVisitId({
    visit_id, //
  }: IReviewsServiceFindOneByVisitId): Promise<Image[]> {
    const checkVisit = await this.visitService.findByVisitId({
      visit_id, //
    });

    const image = await this.imagesService.findImagesByStudyCafeIds({
      studyCafe_id: checkVisit.studyCafe.studyCafe_id,
    });

    return image;
  }

  async findByUserId({
    user: user_id, //
  }: IReviewsServiceFindByUserId): Promise<Review[]> {
    // Review테이블에 user_id 조회하기
    const checkUser = await this.reviewsRepository.find({
      where: { user: { user_id } },
      relations: ['user'],
    });

    return checkUser;
  }

  // 리뷰 추가
  async createReview({
    review_content, //
    user_id, //
    visit_id, //
  }: IReviewsServiceCreate): Promise<boolean> {
    try {
      // Visit테이블에 visit_id로 조회하기
      const checkVisit = await this.visitService.findByVisitId({ visit_id });

      // checkVisit에 user_id가 현재 로그인한 유저와 같은지 확인
      if (checkVisit.user.user_id !== user_id) {
        throw new UnprocessableEntityException(
          '내가 방문한 방문기록이 아닙니다!',
        );
      }

      // Review테이블에 visit_id로 조회하기
      const checkReview = await this.reviewsRepository.find({
        where: { visit: { visit_id } },
        relations: ['visit', 'user'],
      });

      // checkReview에 값이 있다면 에러
      if (checkReview.length > 0) {
        throw new UnprocessableEntityException(
          '이미 스터디카페의 리뷰를 작성했습니다!',
        );
      }

      // StudyCafe테이블에 visit테이블에 있는 studyCafe_id로 조회하기
      const checkStudyCafe =
        await this.studyCafesService.fetchStudyCafeByIdForUser({
          studyCafe_id: checkVisit.studyCafe.studyCafe_id,
        });

      // Review 테이블에 저장
      const result = await this.reviewsRepository.save({
        review_content,
        user: { user_id },
        visit: { visit_id },
        studyCafe: checkStudyCafe,
      });

      return result ? true : false;
    } catch (error) {
      throw new Error(error);
    }
  }

  // 리뷰 수정
  async updateReview({
    review_content, //
    user_id, //
    review_id, //
  }: IReviewsServiceUpdate): Promise<boolean> {
    try {
      // 지금 로그인한 유저가 리뷰를 적은 유저가 맞는지 확인
      const checkReviewUser = await this.reviewsRepository.find({
        where: { user: { user_id } },
        relations: ['user'],
      });

      // 로그인한 유저가 리뷰를 적은 유저가 아니라면 에러
      if (checkReviewUser[0].user.user_id !== user_id) {
        throw new UnprocessableEntityException('내가 쓴 리뷰가 아닙니다!');
      }

      // 리뷰 수정
      const result = await this.reviewsRepository.update(
        {
          review_id,
        },
        {
          review_content,
        },
      );

      return result.affected ? true : false;
    } catch (error) {
      throw new Error(error);
    }
  }

  // 리뷰 삭제
  async deleteReview({
    user_id, //
    review_id, //
  }: IReviewsServiceCancel): Promise<boolean> {
    try {
      // 지금 로그인한 유저가 리뷰를 적은 유저가 맞는지 확인
      const checkReviewUser = await this.reviewsRepository.find({
        where: { user: { user_id } },
        relations: ['user'],
      });

      // 로그인한 유저가 리뷰를 적은 유저가 아니라면 에러
      if (checkReviewUser[0].user.user_id !== user_id) {
        throw new UnprocessableEntityException('내가 쓴 리뷰가 아닙니다!');
      }

      // 리뷰 삭제
      const result = await this.reviewsRepository.delete({ review_id });

      // return 값이 false면 그 리뷰를 쓴 유저가 지금 로그인한 유저가 아님
      return result.affected ? true : false;
    } catch (error) {
      throw new Error(error);
    }
  }
}
