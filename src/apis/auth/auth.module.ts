import { AuthResolver } from './auth.resolever';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdministersModule } from '../administers/administers.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule, AdministersModule],
  providers: [AuthResolver, AuthService, JwtAccessStrategy],
})
export class AuthModule {}
