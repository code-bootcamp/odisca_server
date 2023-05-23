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
  review_id: string;
}

export interface IReviewsServiceFindByUserId {
  user: string;
}

export interface IReviewsServiceCancel {
  review_id: string;
  user_id: string;
}
