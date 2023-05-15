import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateLoginUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phone: string;
}
