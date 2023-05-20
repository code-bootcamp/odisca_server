export interface IReviewsServiceCreate {
  review_content: string;
  user_id: string;
  visit_id: string;
}

export interface IReviewsServiceUpdate {
  review_id: string;
  review_content: string;
  user_id: string;
}

export interface IReviewsServiceFindOneByVisitId {
  visit: string;
}

export interface IReviewServiceFindByUserId {
  user: string;
}

export interface IReviewsServiceCancel {
  review_id: string;
  user_id: string;
}
