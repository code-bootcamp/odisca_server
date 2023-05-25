import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Seat } from 'src/apis/seats/entities/seat.entity';
import { Visit } from 'src/apis/visit/entities/visit.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
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

  @Column({
    default:
      'https://storage.googleapis.com/wisc-storage/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202023-05-25%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%202.23.07.png',
  })
  @Field(() => String, {
    defaultValue:
      'https://storage.googleapis.com/wisc-storage/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202023-05-25%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%202.23.07.png',
  })
  user_image?: string;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  user_deletedAt?: Date;

  @OneToMany(() => Visit, (visit) => visit.user)
  @Field(() => [Visit])
  visits: Visit[];

  @OneToMany(() => Seat, (seat) => seat.user)
  @Field(() => [Seat])
  seat: Seat[];
}
