import * as bcrypt from 'bcrypt';
import { IAuthServiceLogin } from './interfaces/auth-service.interface';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AdministersService } from '../administers/administers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly administersService: AdministersService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 기본 로그인
  async login({ loginInput, context }: IAuthServiceLogin): Promise<string> {
    const { email, password } = loginInput;
    // 이메일이 존재하는지 확인
    const user = await this.usersService.findOneByEmail({ email });
    const administer = await this.administersService.findOneByEmail({ email });
    if (!user && !administer)
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');

    // 비밀번호 일치하는지 확인
    // 유저
    if (user) {
      const isAuth = await bcrypt.compare(password, user.password);
      if (!isAuth)
        throw new UnprocessableEntityException('비밀번호를 확인해주세요.');

      // 로그인 & refresh 토큰 발급
      this.setRefreshToken(user, context);
      // access 토큰 발급
      return this.getAccessToken(user);
    }
    // 관리자
    else if (administer) {
      const isAuth = await bcrypt.compare(password, administer.password);
      if (!isAuth)
        throw new UnprocessableEntityException('비밀번호를 확인해주세요.');

      // 로그인 & refresh 토큰 발급
      this.setRefreshToken(administer, context);
      // access 토큰 발급
      return this.getAccessToken(administer);
    }
  }

  // access 토큰 발급
  getAccessToken(person): string {
    return this.jwtService.sign(
      { sub: person.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    );
  }
  // refresh 토큰 발급
  setRefreshToken(user, context): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );
    context.res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/;`,
    );
  }
}
