import { CreateUserInput } from '../dto/create-user.input';
import { UpdateLoginUserInput } from '../dto/update-login-user.input';

export interface IUsersServiceFindOneById {
  user_id: string;
}
export interface IUsersServiceCreate {
  createUserInput: CreateUserInput;
}

export interface IUsersServiceFindOneByEmail {
  user_email: string;
}

export interface IUsersServiceSoftDelete {
  user_id: string;
}

export interface IUsersServiceUpdate {
  user_id: string;
  updateLoginUserInput: UpdateLoginUserInput;
}
