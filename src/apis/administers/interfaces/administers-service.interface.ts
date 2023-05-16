import { CreateAdministerInput } from '../dto/create-administer.input';

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
