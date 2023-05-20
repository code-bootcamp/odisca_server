import { InputType, OmitType } from '@nestjs/graphql';
import { Image } from '../entities/image.entity';

@InputType()
export class CreateImageInput extends OmitType(
  Image,
  ['image_id', 'studyCafe'],
  InputType,
) {}
