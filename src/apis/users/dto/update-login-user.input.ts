import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateLoginUserInput {
  @Field(() => String)
  user_name: string;

  @Field(() => String)
  user_email: string;

  @Field(() => String)
  user_password: string;

  @Field(() => String)
  user_phone: string;
}
