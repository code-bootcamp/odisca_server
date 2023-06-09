import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const blackListRedis = await this.cacheManager.get(
      `accessToken:${accessToken}`,
    );
    console.log(payload);
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
