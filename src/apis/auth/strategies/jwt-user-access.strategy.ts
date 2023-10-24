import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class JwtUserAccessStrategy extends PassportStrategy(
  Strategy,
  'user-access',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_KEY_USER,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const blackListRedis = await this.cacheManager.get(
      `accessToken:${accessToken}`,
    );
    if (blackListRedis === accessToken) {
      throw new UnauthorizedException();
    } else {
      return {
        id: payload.sub,
        exp: payload.exp,
      };
    }
  }
}
