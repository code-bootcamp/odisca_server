import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateLoginAdministerInput {
  @Field(() => String)
  password: string;

  @Field(() => String)
  phone: string;
}
