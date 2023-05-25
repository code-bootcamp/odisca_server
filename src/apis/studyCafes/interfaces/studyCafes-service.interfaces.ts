import { CreateCafeFloorPlanInput } from '../dto/create-floorPlan.input';
import { CreateStudyCafeInput } from '../dto/create-studyCafe.input';
import { UpdateStudyCafeInput } from '../dto/update-studyCafe.input';

export interface IStudyCafesServiceCreate {
  createStudyCafeInput: CreateStudyCafeInput;
  administer_id: string;
}

export interface IStudyCafesServiceCreateCafeFloorPlan {
  createCafeFloorPlanInput: CreateCafeFloorPlanInput;
}

export interface IStudyCafesServiceUpdate {
  updateStudyCafeInput: UpdateStudyCafeInput;
  administer_id: string;
}

export interface IStudyCafesServiceFetchStudyCafesById {
  administer_id: string;
}

export interface IStudyCafesServiceFetchStudyCafeById {
  studyCafe_id: string;
}
