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
  user_id: string;

  @Column()
  @Field(() => String)
  user_name: string;

  @Column({ unique: true })
  @Field(() => String)
  user_email: string;

  @Column()
  user_password: string;

  @Column()
  @Field(() => String)
  user_phone: string;

  @Column({ default: 0 })
  @Field(() => Int)
  user_point?: number;

  @Column({ default: 'defaultImageUrl' })
  @Field(() => String, { defaultValue: 'defaultImageUrl' })
  user_image?: string;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  user_deletedAt?: Date;
}
