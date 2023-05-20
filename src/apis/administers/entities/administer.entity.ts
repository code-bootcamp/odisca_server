import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Administer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  administer_id: string;

  @Column()
  @Field(() => String)
  administer_name: string;

  @Column({ unique: true })
  @Field(() => String)
  administer_email: string;

  @Column()
  @Field(() => String)
  administer_password: string;

  @Column()
  @Field(() => String)
  administer_phone: string;

  @Column({ default: 0 })
  @Field(() => Int)
  administer_point: number;

  @DeleteDateColumn()
  @Field(() => Date)
  administer_deletedAt: Date;
}
