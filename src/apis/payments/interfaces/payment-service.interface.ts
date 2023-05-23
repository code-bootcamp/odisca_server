import { POINT_TRANSACTION_STATUS_ENUM } from 'src/apis/pointTransactions/entities/pointTransaction.entity';

export interface IPaymentsServiceCreate {
  payment_point: number;
  payment_time: number;
  user_id: string;
  studyCafe_id: string;
  seat_id: string;
  status?: POINT_TRANSACTION_STATUS_ENUM;
}
