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

  async checkPaid({ impUid, amount }: IIamportServiceCheckPaid): Promise<void> {
    try {
      const token = await this.getToken();
      const result = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`,
        { headers: { Authorization: token } },
      );

      if (amount !== result.data.response.amount) {
        throw new UnprocessableEntityException(
          '유효하지 않은 결제 금액입니다.',
        );
      }
    } catch (error) {
      // console.log(error);
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

  async cancel({ impUid }: IIamportServiceCancel): Promise<void> {
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
          imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
        },
      });
      return;
    } catch (error) {
      // console.log(error);
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
