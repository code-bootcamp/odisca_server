import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column({ default: 0 })
  @Field(() => Int)
  point?: number;

  @Column({ default: 'defaultImageUrl' })
  @Field(() => String, { defaultValue: 'defaultImageUrl' })
  image?: string;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
