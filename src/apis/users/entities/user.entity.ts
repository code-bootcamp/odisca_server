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
    default: 'https://storage.googleapis.com/wisc-storage/My%20project-1.png',
  })
  @Field(() => String, {
    defaultValue:
      'https://storage.googleapis.com/wisc-storage/My%20project-1.png',
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
