import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministersResolver } from './administers.resolver';
import { AdministersService } from './administers.service';
import { Administer } from './entities/administer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Administer, //
    ]),
  ],
  providers: [
    AdministersResolver, //
    AdministersService, //
  ],
  exports: [AdministersService],
})
export class AdministersModule {}
