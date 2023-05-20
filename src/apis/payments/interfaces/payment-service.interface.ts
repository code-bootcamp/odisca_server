import { POINT_TRANSACTION_STATUS_ENUM } from 'src/apis/pointTransactions/entities/pointTransaction.entity';
import { IAuthUser } from 'src/common/interfaces/context';

export interface IPaymentsServiceCreate {
  payment_point: number;
  payment_time: number;
  user_id: string;
  studyCafe_id: string;
  seat_id: string;
  status?: POINT_TRANSACTION_STATUS_ENUM;
}
