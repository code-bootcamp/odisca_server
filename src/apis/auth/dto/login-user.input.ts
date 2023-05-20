import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field(() => String)
  user_email: string;

  @Field(() => String)
  user_password: string;
}
