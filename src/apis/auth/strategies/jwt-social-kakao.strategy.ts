import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL:
        'https://odisca.store/user/login/kakao' ||
        'https://odisca.store/admin/login/kakao',
      scope: ['account_email', 'profile_nickname'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      password: '1234',
      phone: '010-1111-1111',
    };
  }
}
