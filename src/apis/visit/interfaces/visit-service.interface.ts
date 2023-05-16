import { Field } from '@nestjs/graphql';

export interface IVisitServiceCreate {
  user: string;
  studyCafe: string;
}
