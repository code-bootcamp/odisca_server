import { CreateAdministerInput } from '../dto/create-administer.input';
import { UpdateLoginAdministerInput } from '../dto/update-login-administer.input';

export interface IAdministersServiceFindOne {
  email: string;
}

export interface IAdministersServiceCreate {
  createAdministerInput: CreateAdministerInput;
}

export interface IAdministersServiceFindOneById {
  adminId: string;
}

export interface IAdministersServiceSoftDelete {
  adminId: string;
}

export interface IAdministerServiceUpdate {
  adminId: string;
  updateLoginAdministerInput: UpdateLoginAdministerInput;
}
