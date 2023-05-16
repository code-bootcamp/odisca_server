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
