import { User } from 'src/apis/users/entities/user.entity';
import { IContext, IAuthUser } from 'src/common/interfaces/context';
import { LoginInput } from '../dto/login.input';

export interface IAuthServiceLogin {
  loginInput: LoginInput;
  context: IContext;
}
