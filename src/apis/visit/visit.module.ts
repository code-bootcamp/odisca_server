import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { VisitService } from './visit.service';
import { VisitResolver } from './visit.resolver';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Visit, //
      User, //
    ]),
  ],
  providers: [
    VisitResolver, //
    VisitService, //
    UsersService, //
  ],
  exports: [
    // exports 설정
    VisitService, //
  ],
})
export class VisitModule {}
