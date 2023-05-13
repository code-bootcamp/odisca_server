import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Administer } from 'src/apis/administers/entities/administer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class StudyCafe {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  contact: string;

  @Column()
  @Field(() => Int)
  timeFee: number;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  operatingTime: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  lon: number;

  @Column()
  @Field(() => String)
  brn: string;

  @Column()
  @Field(() => Int)
  seatCount: number;

  @Column()
  @Field(() => Int)
  floorPlanX: number;

  @Column()
  @Field(() => Int)
  floorPlanY: number;

  @ManyToOne(() => Administer)
  @Field(() => Administer)
  administer: Administer;
}
