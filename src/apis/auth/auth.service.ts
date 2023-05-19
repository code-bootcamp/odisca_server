import * as bcrypt from 'bcrypt';
import {
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AdministersService } from '../administers/administers.service';
import { IAuthServiceRestoreAccessToken } from './interfaces/auth-service.interface';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly administersService: AdministersService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 인증번호 이메일 전송 //
  async sendVerificationCode({ email }) {
    const verificationCode = String(
      Math.floor(Math.random() * 1000000),
    ).padStart(6, '0');
    try {
      await this.mailerService.sendMail({
        to: email,
        from: process.env.MAIL,
        subject: '[odisca] : 인증번호를 안내드립니다.',
        html: `회원님의 인증번호는 ${verificationCode}입니다.`,
      });
      await this.cacheManager.set(
        `verificationCode:${verificationCode}`,
        verificationCode,
        {
          ttl: 180,
        },
      );
    } catch (error) {
      console.log(error);
      throw new NotAcceptableException();
    }
    return `인증번호:${verificationCode} 전송완료`;
  }

  // 인증 번호 확인 //
  async checkVerificationCode({ verificationCode }) {
    const savedVerificationCode = await this.cacheManager.get(
      `verificationCode:${verificationCode}`,
    );
    if (verificationCode !== savedVerificationCode)
      throw new UnauthorizedException('인증실패');
    return '인증완료';
  }

  // 유저 로그인 //
  async loginUser({ loginInput, context }): Promise<string> {
    const { email, password } = loginInput;
    // 이메일이 존재하는지 확인
    const user = await this.usersService.findOneByEmail({ email });
    if (!user)
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호를 확인해주세요.');
    // 로그인 & refresh 토큰 발급
    this.setRefreshToken({ user, res: context.res, req: context.req });
    // access 토큰 발급
    return this.getAccessToken({ user });
  }

  // 관리자 로그인 //
  async loginAdminister({ loginInput, context }): Promise<string> {
    const { email, password } = loginInput;
    // 이메일이 존재하는지 확인
    const user = await this.administersService.findOneByEmail({ email });
    if (!user)
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호를 확인해주세요.');
    // 로그인 & refresh 토큰 발급
    this.setRefreshToken({ user, res: context.res, req: context.req });
    // access 토큰 발급
    return this.getAccessToken({ user });
  }

  // 회원 소셜로그인 //
  async socialUserLogin({ req, res }) {
    const user = await this.usersService.findOneByEmail({
      email: req.user.email,
    });
    // 기존 가입 회원 아닌 경우 회원가입
    if (!user) {
      const createUserInput = {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        password: req.user.password,
      };
      return this.usersService.create({
        createUserInput,
      });
    }

    // 회원가입이 완료된 상태라면 로그인하기
    this.setRefreshToken({ user, res, req });
    res.redirect('http://127.0.0.1:5501/frontend%20/login/index.html');
  }

  // 관리자 소셜로그인 //
  async socialAdministerLogin({ req, res }) {
    const user = await this.administersService.findOneByEmail({
      email: req.user.email,
    });
    // 기존 가입 회원 아닌 경우 회원가입
    if (!user) {
      const createAdministerInput = {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        password: req.user.password,
      };
      return this.administersService.create({
        createAdministerInput,
      });
    }
    // 회원가입이 완료된 상태라면 로그인하기
    this.setRefreshToken({ user, res, req });
    res.redirect('http://127.0.0.1:5501/frontend%20/login/index.html');
  }

  // access 토큰 발급 //
  getAccessToken({ user }): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    );
  }

  // refresh 토큰 발급
  setRefreshToken({ user, res, req }): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    const Origins = ['http://localhost:3000', 'https://odisca.store'];
    const origin = req.headers.origin;
    if (Origins.includes(origin)) {
      res.setHeader(
        'Set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain=.odisca.store; SameSite=None; Secure; httpOnly;`,
      );
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }

  restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
    return this.getAccessToken({ user });
  }

  // 로그아웃시 토큰 redis 저장
  async blackList({ context }) {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    try {
      // accessToken 검증
      const decodedAcc = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, {
        complete: true,
      }) as jwt.JwtPayload;
      // refreshToken 검증
      const decodeRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
        { complete: true },
      ) as jwt.JwtPayload;
      // 남은 만료시간
      const remainedExpireAcc = Math.floor(
        decodedAcc.payload.exp - new Date().getTime() / 1000,
      );

      const remainedExpireRefresh = Math.floor(
        decodeRefresh.payload.exp - new Date().getTime() / 1000,
      );
      // redis에 저장
      await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
        ttl: remainedExpireAcc,
      });
      await this.cacheManager.set(
        `refreshToken:${refreshToken}`,
        refreshToken,
        {
          ttl: remainedExpireRefresh,
        },
      );
      return '로그아웃에 성공했습니다.';
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
