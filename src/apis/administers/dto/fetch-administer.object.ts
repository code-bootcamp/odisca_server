import { Field, ObjectType } from '@nestjs/graphql';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { Administer } from '../entities/administer.entity';

@ObjectType()
export class FetchAdministerWithStudyCafes {
  @Field(() => [StudyCafe])
  studyCafes: StudyCafe[];

  @Field(() => Administer)
  administer: Administer;
}
