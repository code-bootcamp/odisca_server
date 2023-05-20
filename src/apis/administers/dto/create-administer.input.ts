import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAdministerInput {
  @Field(() => String)
  administer_name: string;

  @Field(() => String)
  administer_email: string;

  @Field(() => String)
  administer_password: string;

  @Field(() => String)
  administer_phone: string;
}
