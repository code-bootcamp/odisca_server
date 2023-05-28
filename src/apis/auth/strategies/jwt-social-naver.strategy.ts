import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL:
        'https://odisca.store/user/login/naver' ||
        'https://odisca.store/admin/login/naver',
      scope: ['email', 'name'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      name: profile.name,
      email: profile.email,
      password: '1234',
      phone: profile.mobile,
    };
  }
}
