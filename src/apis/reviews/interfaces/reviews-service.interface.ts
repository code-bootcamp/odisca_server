import { IAuthUser } from '../../../common/interfaces/context';

export interface IReviewsServiceCreate {
  content: string;
  user: IAuthUser['user'];
  visitId: string;
}
