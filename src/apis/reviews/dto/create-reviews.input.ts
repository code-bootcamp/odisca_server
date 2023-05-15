import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  content: string;

  @Field(() => String)
  visitId: string;
}
