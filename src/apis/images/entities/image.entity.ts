import { Field, ObjectType } from '@nestjs/graphql';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  image_id: string;

  @Column()
  @Field(() => String)
  image_url: string;

  @Column()
  @Field(() => Boolean)
  image_isMain: boolean;

  @ManyToOne(() => StudyCafe, (studyCafe) => studyCafe.images)
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;
}
