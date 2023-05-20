import { IAuthUser } from '../../../common/interfaces/context';

export interface IReviewsServiceCreate {
  review_content: string;
  user: IAuthUser['user'];
  visit_id: string;
}

export interface IReviewsServiceUpdate {
  review_id: string;
  review_content: string;
  user: IAuthUser['user'];
}

export interface IReviewsServiceFindOneByVisitId {
  visit: string;
}

export interface IReviewServiceFindByUserId {
  user: string;
}

export interface IReviewsServiceCancel {
  review_id: string;
  user: IAuthUser['user'];
}
