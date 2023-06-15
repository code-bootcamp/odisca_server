import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Review } from './entities/review.entity';
import { IContext } from 'src/common/interfaces/context';
import {
  CancelReviewInput,
  CreateReviewInput,
  UpdateReviewInput,
} from './dto/create-reviews.input';

@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  // Review테이블에 UserId로 모든 리뷰 조회
  @UseGuards(GqlAuthGuard('user-access'))
  @Query(() => [Review])
  async fetchLoginReviewsByUserId(
    @Context() context: IContext, //
  ): Promise<Review[]> {
    const user = context.req.user.id;
    return this.reviewsService.findByUserId({
      user,
    });
  }

  // Review테이블에 visit_id로 리뷰 조회
  @UseGuards(GqlAuthGuard('user-access'))
  @Query(() => Review)
  async fetchLoginReviewByVisitId(
    @Args('visit_id') visit_id: string,
  ): Promise<Review> {
    return this.reviewsService.findByVisitId({
      visit_id,
    });
  }

  // Login한 유저의 방문기록으로 리뷰 작성
  @UseGuards(GqlAuthGuard('user-access'))
  @Mutation(() => Boolean)
  createLoginReview(
    @Args('createReviewInput')
    createReviewInput: CreateReviewInput, //
    @Context() context: IContext, //
  ): Promise<boolean> {
    const review_content = createReviewInput.review_content;
    const visit_id = createReviewInput.visit_id;
    const user_id = context.req.user.id;
    return this.reviewsService.createReview({
      review_content,
      user_id,
      visit_id,
    });
  }

  // Login한 유저의 방문기록으로 리뷰 수정
  @UseGuards(GqlAuthGuard('user-access'))
  @Mutation(() => Boolean)
  updateLoginReview(
    @Args('updateReviewInput')
    updateReviewInput: UpdateReviewInput, //
    @Context() context: IContext, //
  ): Promise<boolean> {
    const review_content = updateReviewInput.review_content;
    const review_id = updateReviewInput.review_id;
    const user_id = context.req.user.id;
    return this.reviewsService.updateReview({
      review_content,
      user_id,
      review_id,
    });
  }

  // Login한 유저의 방문기록으로 리뷰 삭제
  @UseGuards(GqlAuthGuard('user-access'))
  @Mutation(() => Boolean)
  deleteLoginReview(
    @Args('cancelReviewInput')
    cancelReviewInput: CancelReviewInput, //
    @Context() context: IContext, //
  ): Promise<boolean> {
    const review_id = cancelReviewInput.review_id;
    const user_id = context.req.user.id;
    return this.reviewsService.deleteReview({
      user_id,
      review_id,
    });
  }
}
