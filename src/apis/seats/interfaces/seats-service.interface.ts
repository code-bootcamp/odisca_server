import { CreateSeatsInput } from '../dto/create-seats.input';

export interface ISeatsServiceCreate {
  createSeatsInput: CreateSeatsInput;
}

export interface ICountInUseSeat {
  studyCafe_id: string;
}
