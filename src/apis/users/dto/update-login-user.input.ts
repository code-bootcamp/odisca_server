import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateLoginUserInput {
  @Field(() => String)
  user_password: string;

  @Field(() => String)
  user_phone: string;

  @Field(() => String, { nullable: true })
  user_image?: string;
}
