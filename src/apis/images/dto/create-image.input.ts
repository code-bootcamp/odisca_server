import { InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Image } from '../entities/image.entity';

@InputType()
export class CreateImageInput extends OmitType(
  Image,
  ['image_id', 'studyCafe'],
  InputType,
) {}

@ObjectType()
export class fetchImageObject extends OmitType(
  Image,
  ['studyCafe'],
  ObjectType,
) {}
