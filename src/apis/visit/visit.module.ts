import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { VisitService } from './visit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Visit, //
    ]),
  ],
  providers: [
    VisitService, //
  ],
})
export class VisitModule {}
