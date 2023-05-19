import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { VisitService } from './visit.service';
import { VisitResolver } from './visit.resolver';
import { User } from '../users/entities/user.entity';

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
  ],
})
export class VisitModule {}
