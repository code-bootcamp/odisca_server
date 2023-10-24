import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUser } from 'src/common/interfaces/context';

export interface IOAuthUser {
  user: Omit<User, 'user_id'>;
}

export interface IAuthServiceLoginOAuth {
  req: Request & IOAuthUser;
  res: Response;
}

export interface IAuthServiceRestoreAccessToken {
  user: IAuthUser['user'];
}
