import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Administer } from 'src/apis/administers/entities/administer.entity';
import { Image } from 'src/apis/images/entities/image.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class StudyCafe {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  studyCafe_id: string;

  @Column()
  @Field(() => String)
  studyCafe_name: string;

  @Column()
  @Field(() => String)
  studyCafe_address: string;

  @Column()
  @Field(() => String)
  studyCafe_addressDetail: string;

  @Column()
  @Field(() => String)
  studyCafe_city: string;

  @Column()
  @Field(() => String)
  studyCafe_district: string;

  @Column()
  @Field(() => String)
  studyCafe_contact: string;

  @Column()
  @Field(() => Int)
  studyCafe_timeFee: number;

  @Column()
  @Field(() => String)
  studyCafe_description: string;

  @Column()
  @Field(() => String)
  studyCafe_openTime: string;

  @Column()
  @Field(() => String)
  studyCafe_closeTime: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  studyCafe_lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  studyCafe_lon: number;

  @Column({ unique: true })
  @Field(() => String)
  studyCafe_brn: string;

  @Column({ default: 0 })
  @Field(() => Int)
  studyCafe_seatCount: number;

  @Column({ default: 0 })
  @Field(() => Int)
  studyCafe_floorPlanX: number;

  @Column({ default: 0 })
  @Field(() => Int)
  studyCafe_floorPlanY: number;

  @ManyToOne(() => Administer)
  @Field(() => Administer)
  administer: Administer;

  @OneToMany(() => Image, (image) => image.studyCafe)
  @Field(() => [Image])
  images: Image[];
}
