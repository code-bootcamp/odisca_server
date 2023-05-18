import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { CreateImageInput } from '../dto/create-image.input';

export interface IImagesServiceCreate {
  image: CreateImageInput[];
  result: StudyCafe;
}
