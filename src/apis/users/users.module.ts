import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Image, //
    ]),
  ],
  providers: [
    UsersResolver, //
    UsersService, //
    ImagesService, //
  ],
  exports: [UsersService],
})
export class UsersModule {}
