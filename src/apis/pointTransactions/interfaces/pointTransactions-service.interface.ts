import { IAuthUser } from '../../../common/interfaces/context';
import {
  POINT_TRANSACTION_STATUS_ENUM,
  PointTransaction,
} from '../entities/pointTransaction.entity';

export interface IPointTransactionsServiceFindOneByImpUid {
  pointTransaction_impUid: string;
}

export interface IPointTransactionsServiceCheckDuplication {
  pointTransaction_impUid: string;
}

export interface IPointTransactionsServiceCreate {
  pointTransaction_impUid: string;
  pointTransaction_amount: number;
  user_id: string;
  pointTransaction_status?: POINT_TRANSACTION_STATUS_ENUM;
}

// export interface IPointTransactionsServiceCreateForPayment {
//   pointTransaction_impUid: string;
//   amount: number;
//   user: IAuthUser['user'];
// }

// export interface IPointTransactionsServiceFindByImpUidAndUser {
//   pointTransaction_impUid: string;
//   user: IAuthUser['user'];
// }

// export interface IPointTransactionsServiceCheckAlreadyCanceled {
//   pointTransactions: PointTransaction[];
// }

// export interface IPointTransactionsServiceCheckHasCancelablePoint {
//   pointTransactions: PointTransaction[];
// }

export interface IPointTransactionsServiceCancel {
  pointTransaction_impUid: string;
  user_id: string;
}
