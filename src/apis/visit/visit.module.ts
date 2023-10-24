import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { VisitService } from './visit.service';
import { VisitResolver } from './visit.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Visit, //
    ]),
  ],
  providers: [
    VisitResolver, //
    VisitService, //
  ],
})
export class VisitModule {}
