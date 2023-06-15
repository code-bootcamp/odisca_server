import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginAdministerInput {
  @Field(() => String)
  administer_email: string;

  @Field(() => String)
  administer_password: string;
}
