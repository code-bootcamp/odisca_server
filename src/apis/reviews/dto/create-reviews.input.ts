import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  review_content: string;

  @Field(() => String)
  visit_id: string;
}

@InputType()
export class UpdateReviewInput {
  @Field(() => String)
  review_id: string;

  @Field(() => String)
  review_content: string;
}

@InputType()
export class CancelReviewInput {
  @Field(() => String)
  review_id: string;
}
