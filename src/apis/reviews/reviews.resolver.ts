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

  @Query(() => [Review])
  async fetchReviewsByUserId(
    @Context() context: IContext, //
  ): Promise<Review[]> {
    const user = context.req.user.id;
    return await this.reviewsService.findByUserId({
      user,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput')
    createReviewInput: CreateReviewInput,
    @Context() context: IContext,
  ): Promise<Review> {
    const content = createReviewInput.content;
    const visit = createReviewInput.visitId;
    const user = context.req.user;
    return this.reviewsService.createReview({
      content,
      user,
      visit,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Boolean)
  updateReview(
    @Args('updateReviewInput')
    updateReviewInput: UpdateReviewInput,
    @Context() context: IContext,
  ): Promise<boolean> {
    const content = updateReviewInput.content;
    const visit = updateReviewInput.visitId;
    const review = updateReviewInput.reviewId;
    const user = context.req.user;
    return this.reviewsService.updateReview({
      content,
      user,
      visit,
      review,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Boolean)
  deleteReview(
    @Args('cancelReviewInput')
    cancelReviewInput: CancelReviewInput,
    @Context() context: IContext,
  ): Promise<boolean> {
    const review = cancelReviewInput.reviewId;
    const user = context.req.user;
    return this.reviewsService.deleteReview({
      user,
      review,
    });
  }
}
