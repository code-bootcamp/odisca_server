import { Module } from '@nestjs/common';
import { StudyCafesResolver } from './studyCafes.resolver';
import { StudyCafesService } from './studyCafes.service';

@Module({
  // imports: [],
  // controllers: [],
  providers: [StudyCafesResolver, StudyCafesService],
})
export class StudyCafeModule {}
