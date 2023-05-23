import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { VisitService } from './visit.service';
import { VisitResolver } from './visit.resolver';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Visit, //
      User, //
      Image,
    ]),
  ],
  providers: [
    VisitResolver, //
    VisitService, //
    UsersService, //
    ImagesService,
  ],
  exports: [
    // exports 설정
    VisitService, //
  ],
})
export class VisitModule {}
