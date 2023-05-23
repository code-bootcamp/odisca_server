import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../images/entities/image.entity';
import { ImagesService } from '../images/images.service';
import { StudyCafe } from '../studyCafes/entities/studyCafe.entity';
import { StudyCafesService } from '../studyCafes/studyCafes.service';
import { AdministersResolver } from './administers.resolver';
import { AdministersService } from './administers.service';
import { Administer } from './entities/administer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Administer, StudyCafe, Image])],
  providers: [
    AdministersResolver,
    AdministersService,
    StudyCafesService,
    ImagesService,
  ],
  exports: [AdministersService],
})
export class AdministersModule {}
