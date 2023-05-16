import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyCafe } from './entities/studyCafe.entity';
import { StudyCafesResolver } from './studyCafes.resolver';
import { StudyCafesService } from './studyCafes.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyCafe])],
  // controllers: [],
  providers: [StudyCafesResolver, StudyCafesService],
})
export class StudyCafesModule {}
