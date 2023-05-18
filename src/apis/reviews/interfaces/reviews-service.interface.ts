import { IAuthUser } from '../../../common/interfaces/context';

export interface IReviewsServiceCreate {
  content: string;
  user: IAuthUser['user'];
  visit: string;
}

export interface IReviewsServiceUpdate {
  review: string;
  content: string;
  user: IAuthUser['user'];
  visit: string;
}

export interface IReviewsServiceFindOneByVisitId {
  visit: string;
}

export interface IReviewServiceFindByUserId {
  user: string;
}

export interface IReviewsServiceCancel {
  review: string;
  user: IAuthUser['user'];
}
