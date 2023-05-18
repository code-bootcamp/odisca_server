import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { StudyCafe } from './entities/studyCafe.entity';
import { StudyCafesResolver } from './studyCafes.resolver';
import { StudyCafesService } from './studyCafes.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyCafe, Image])],
  // controllers: [],
  providers: [StudyCafesResolver, StudyCafesService, ImagesService],
})
export class StudyCafesModule {}
