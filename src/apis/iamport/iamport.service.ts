import {
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import {
  IIamportServiceCancel,
  IIamportServiceCheckPaid,
} from './interfaces/iamport-service.interface';

@Injectable()
export class IamportService {
  // axios에서 access_token 받아오기
  async getToken(): Promise<string> {
    try {
      const result = await axios.post(`https://api.iamport.kr/users/getToken`, {
        imp_key: process.env.IMP_API_KEY,
        imp_secret: process.env.IMP_API_SECRET,
      });
      return result.data.response.access_token;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }

  // axios에서 금액 받아와서 입력된 금액이랑 맞는지 확인하기
  async checkPaid({
    pointTransaction_impUid, //
    pointTransaction_amount, //
  }: IIamportServiceCheckPaid): Promise<void> {
    try {
      const token = await this.getToken();
      const result = await axios.get(
        `https://api.iamport.kr/payments/${pointTransaction_impUid}`,
        { headers: { Authorization: token } },
      );

      if (pointTransaction_amount !== result.data.response.amount) {
        throw new UnprocessableEntityException(
          '유효하지 않은 결제 금액입니다.',
        );
      }
    } catch (error) {
      if (error.response.data) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw new HttpException(error.response.message, error.response.status);
      }
    }
  }

  // axios에서 결제 취소하기
  async cancel({
    pointTransaction_impUid,
  }: IIamportServiceCancel): Promise<void> {
    try {
      const mytoken = await this.getToken();

      await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mytoken}`, // 포트원 서버로부터 발급받은 엑세스 토큰
        },
        data: {
          imp_uid: pointTransaction_impUid, // imp_uid를 환불 `unique key`로 입력
        },
      });
      return;
    } catch (error) {
      if (error.response.data) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw new HttpException(error.response.message, error.response.status);
      }
    }
  }
}
