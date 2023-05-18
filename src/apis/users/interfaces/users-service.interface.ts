import { UpdateLoginAdministerInput } from 'src/apis/administers/dto/update-login-administer.input';
import { CreateUserInput } from '../dto/create-user.input';

export interface IUsersServiceFindOneById {
  userId: string;
}
export interface IUsersServiceCreate {
  createUserInput: CreateUserInput;
}

export interface IUsersServiceFindOneByEmail {
  email: string;
}

export interface IUsersServiceSoftDelete {
  userId: string;
}

export interface IUsersServiceUpdate {
  userId: string;
  updateLoginUserInput: UpdateLoginAdministerInput;
}
