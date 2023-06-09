import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Review } from './entities/review.entity';
import { IContext } from 'src/common/interfaces/context';
import {
  CreateReviewInput,
  UpdateReviewInput,
} from './dto/create-reviews.input';

@Resolver()
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput')
    createReviewInput: CreateReviewInput,
    @Context() context: IContext,
  ): Promise<Review> {
    const content = createReviewInput.content;
    const visitId = createReviewInput.visitId;
    const user = context.req.user;
    return this.reviewsService.create({
      content,
      user,
      visitId,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput')
    updateReviewInput: UpdateReviewInput,
    @Context() context: IContext,
  ): Promise<boolean> {
    const content = updateReviewInput.content;
    const visitId = updateReviewInput.visitId;
    const reviewId = updateReviewInput.reviewId;
    const user = context.req.user;
    return this.reviewsService.update({
      content,
      user,
      visitId,
      reviewId,
    });
  }
}
