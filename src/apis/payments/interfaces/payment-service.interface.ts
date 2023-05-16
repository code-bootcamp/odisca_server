import { POINT_TRANSACTION_STATUS_ENUM } from 'src/apis/pointTransactions/entities/pointTransaction.entity';
import { IAuthUser } from 'src/common/interfaces/context';

export interface IPaymentsServiceCreate {
  point: number;
  user: IAuthUser['user'];
  studyCafeId: string;
  status?: POINT_TRANSACTION_STATUS_ENUM;
}
