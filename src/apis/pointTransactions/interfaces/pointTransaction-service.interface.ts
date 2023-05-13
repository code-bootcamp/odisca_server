import { IAuthUser } from './context';

export interface IPointTransactionsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
}
