import { User } from 'src/apis/users/entities/user.entity';
import { IContext, IAuthUser } from 'src/common/interfaces/context';
import { LoginInput } from '../dto/login.input';

export interface IAuthServiceLogin {
  loginInput: LoginInput;
  context: IContext;
}

export interface IAuthServiceLogin {
  email: string;
  password: string;
  context: IContext;
}

export interface IOAuthUser {
  user: Omit<User, 'id'>;
}

export interface IAuthServiceLoginOAuth {
  req: Request & IOAuthUser;
  res: Response;
}

export interface IAuthServiceRestoreAccessToken {
  user: IAuthUser['user'];
}
