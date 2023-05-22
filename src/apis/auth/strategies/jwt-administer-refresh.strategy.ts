import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { Strategy } from 'passport-jwt';

export class JwtAdministerRefreshStrategy extends PassportStrategy(
  Strategy,
  'administer-refresh',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: process.env.JWT_REFRESH_KEY_ADMINISTER,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const refreshToken = req.headers.cookie.replace('refreshToken=', '');
    const blackListRedis = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );
    if (refreshToken === blackListRedis) {
      throw new UnauthorizedException();
    } else {
      return {
        id: payload.sub,
      };
    }
  }
}
