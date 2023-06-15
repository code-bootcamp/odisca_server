import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateLoginAdministerInput {
  @Field(() => String)
  administer_password: string;

  @Field(() => String)
  administer_phone: string;
}
