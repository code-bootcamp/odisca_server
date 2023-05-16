import { IAuthUser } from '../../../common/interfaces/context';

export interface IReviewsServiceCreate {
  content: string;
  user: IAuthUser['user'];
  visit: string;
}

export interface IReviewsServiceUpdate {
  reviewId: string;
  content: string;
  user: IAuthUser['user'];
  visit: string;
}

export interface IReviewsServiceFindOneByVisitId {
  visit: string;
}
