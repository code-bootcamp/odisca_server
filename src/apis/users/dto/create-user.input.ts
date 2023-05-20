import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  user_name: string;

  @Field(() => String)
  user_email: string;

  @Field(() => String, { nullable: true })
  user_password: string;

  @Field(() => String, { nullable: true })
  user_phone: string;
}
