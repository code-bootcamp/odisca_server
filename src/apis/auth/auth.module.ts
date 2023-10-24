import { AuthResolver } from './auth.resolever';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdministersModule } from '../administers/administers.module';
import { JwtUserAccessStrategy } from './strategies/jwt-user-access.strategy';
import { JwtGoogleStrategy } from './strategies/jwt-social-google.strategy';
import { JwtKakaoStrategy } from './strategies/jwt-social-kakao.strategy';
import { JwtNaverStrategy } from './strategies/jwt-social-naver.strategy';
import { AuthController } from './auth.controller';
import { MailerModule } from '@nest-modules/mailer';
import { JwtUserRefreshStrategy } from './strategies/jwt-user-refresh.strategy';
import { JwtAdministerAccessStrategy } from './strategies/jwt-administer-access.strategy';
import { JwtAdministerRefreshStrategy } from './strategies/jwt-administer-refresh.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    AdministersModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        },
      }),
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtUserAccessStrategy,
    JwtUserRefreshStrategy,
    JwtAdministerAccessStrategy,
    JwtAdministerRefreshStrategy,
    JwtGoogleStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
