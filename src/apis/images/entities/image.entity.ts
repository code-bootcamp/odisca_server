import { Field, ObjectType } from '@nestjs/graphql';
import { StudyCafe } from 'src/apis/studyCafes/entities/studyCafe.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column()
  @Field(() => Boolean)
  isMain: boolean;

  @ManyToOne(() => StudyCafe)
  @Field(() => StudyCafe)
  studyCafe: StudyCafe;
}
