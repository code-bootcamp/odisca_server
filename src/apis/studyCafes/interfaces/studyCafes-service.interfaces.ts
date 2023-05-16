import { CreateCafeFloorPlanInput } from '../dto/create-floorPlan.input';
import { CreateStudyCafeInput } from '../dto/create-studyCafe.input';
import { UpdateStudyCafeInput } from '../dto/update-studyCafe.input';

export interface IStudyCafesServiceCreate {
  createStudyCafeInput: CreateStudyCafeInput;
  adminId: string;
}

export interface IStudyCafesServiceCreateCafeFloorPlan {
  createCafeFloorPlanInput: CreateCafeFloorPlanInput;
}

export interface IStudyCafesServiceUpdate {
  updateStudyCafeInput: UpdateStudyCafeInput;
  adminId: string;
}

export interface IStudyCafesServiceFetchStudyCafesById {
  adminId: string;
}

export interface IStudyCafesServiceFetchStudyCafeById {
  studyCafeId: string;
}
