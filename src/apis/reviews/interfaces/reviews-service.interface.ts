import { IAuthUser } from '../../../common/interfaces/context';

export interface IReviewsServiceCreate {
  content: string;
  user: IAuthUser['user'];
  visitId: string;
}

export interface IReviewsServiceUpdate {
  reviewId: string;
  content: string;
  user: IAuthUser['user'];
  visitId: string;
}

export interface IReviewsServiceFindOneByVisitId {
  visitId: string;
}
