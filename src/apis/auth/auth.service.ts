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
import coolsms from 'coolsms-node-sdk';
import { verificationCode, template } from './email.template';
@Injectable()
export class AuthService {
  constructor(
    private readonly administersService: AdministersService, //
    private readonly usersService: UsersService, //
    private readonly jwtService: JwtService, //
    private readonly mailerService: MailerService, //

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache, //
  ) {}

  // 인증번호 이메일 전송 //
  async sendVerificationCode({ email }): Promise<string> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: process.env.MAIL,
        subject: '[odisca] : 인증번호를 안내드립니다.',
        html: template,
      });
      await this.cacheManager.set(
        `verificationCode:${verificationCode}`,
        verificationCode,
        {
          ttl: 180,
        },
      );
    } catch (error) {
      throw new NotAcceptableException(error);
    }
    return `인증번호:${verificationCode} 전송완료`;
  }

  // 인증 번호 확인 //
  async checkVerificationCode({ verificationCode }): Promise<string> {
    const savedVerificationCode = await this.cacheManager.get(
      `verificationCode:${verificationCode}`,
    );
    if (verificationCode !== savedVerificationCode)
      throw new UnauthorizedException('인증실패');
    return '인증완료';
  }

  // 유저 로그인 //
  async loginUser({ loginUserInput, context }): Promise<string> {
    const { user_email, user_password } = loginUserInput;
    // 이메일이 존재하는지 확인
    const user = await this.usersService.findOneByEmail({ user_email });
    if (!user)
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');
    const isAuth = await bcrypt.compare(user_password, user.user_password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호를 확인해주세요.');
    // 로그인 & refresh 토큰 발급
    this.setRefreshTokenForUser({
      user: user.user_id,
      res: context.res,
      req: context.req,
    });
    // access 토큰 발급
    return this.getAccessTokenForUser({ user: user.user_id });
  }

  // 관리자 로그인 //
  async loginAdminister({ loginAdministerInput, context }): Promise<string> {
    const { administer_email, administer_password } = loginAdministerInput;
    // 이메일이 존재하는지 확인
    const administer = await this.administersService.findOneByEmail({
      administer_email,
    });
    if (!administer)
      throw new UnprocessableEntityException('이메일이 존재하지 않습니다.');
    const isAuth = await bcrypt.compare(
      administer_password,
      administer.administer_password,
    );
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호를 확인해주세요.');
    // 로그인 & refresh 토큰 발급
    this.setRefreshTokenForAdminister({
      administer: administer.administer_id,
      res: context.res,
      req: context.req,
    });
    // access 토큰 발급
    return this.getAccessTokenForAdminister({
      administer: administer.administer_id,
    });
  }

  // 회원 소셜로그인 //
  async socialUserLogin({ req, res }) {
    const user = await this.usersService.findOneByEmail({
      user_email: req.user.email,
    });
    // 기존 가입 회원 아닌 경우 회원가입
    if (!user) {
      const createUserInput = {
        user_name: req.user.name,
        user_email: req.user.email,
        user_phone: req.user.phone,
        user_password: req.user.password,
      };
      return this.usersService.create({
        createUserInput,
      });
    }

    // 회원가입이 완료된 상태라면 로그인하기
    this.setRefreshTokenForUser({ user, res, req });
    res.redirect('http://127.0.0.1:5501/frontend%20/login/index.html');
  }

  // 관리자 소셜로그인 //
  async socialAdministerLogin({ req, res }) {
    const administer = await this.administersService.findOneByEmail({
      administer_email: req.administer.email,
    });
    // 기존 가입 회원 아닌 경우 회원가입
    if (!administer) {
      const createAdministerInput = {
        administer_name: req.administer.name,
        administer_email: req.administer.email,
        administer_phone: req.administer.phone,
        administer_password: req.administer.password,
      };
      return this.administersService.create({
        createAdministerInput,
      });
    }
    // 회원가입이 완료된 상태라면 로그인하기
    this.setRefreshTokenForAdminister({ administer, res, req });
    res.redirect('http://127.0.0.1:5501/frontend%20/login/index.html');
  }

  // 유저 access 토큰 발급 //
  getAccessTokenForUser({ user }): string {
    return this.jwtService.sign(
      { sub: user },
      { secret: process.env.JWT_ACCESS_KEY_USER, expiresIn: '1h' },
    );
  }

  // 유저 refresh 토큰 발급
  setRefreshTokenForUser({ user, res, req }): void {
    const refreshToken = this.jwtService.sign(
      { sub: user },
      { secret: process.env.JWT_REFRESH_KEY_USER, expiresIn: '2w' },
    );
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    const Origins = [
      'http://localhost:3000',
      'https://odisca.store',
      'http://127.0.0.1:3000',
      'https://34.64.94.142:3000',
      'https://odisca.co.kr',
    ];
    const origin = req.headers.origin;
    if (Origins.includes(origin)) {
      res.setHeader(
        'Set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain=.odisca.store; SameSite=None; Secure; httpOnly;`,
      );
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }

  // 유저 restore
  restoreAccessTokenForUser({ user }: IAuthServiceRestoreAccessToken): string {
    return this.getAccessTokenForUser({ user: user.id });
  }

  // 관리자 access 토큰 발급 //
  getAccessTokenForAdminister({ administer }): string {
    return this.jwtService.sign(
      { sub: administer },
      { secret: process.env.JWT_ACCESS_KEY_ADMINISTER, expiresIn: '1h' },
    );
  }

  // 관리자 refresh 토큰 발급
  setRefreshTokenForAdminister({ administer, res, req }): void {
    const refreshToken = this.jwtService.sign(
      { sub: administer },
      { secret: process.env.JWT_REFRESH_KEY_ADMINISTER, expiresIn: '2w' },
    );
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    const Origins = [
      'http://localhost:3000',
      'https://odisca.store',
      'http://127.0.0.1:3000',
      'https://34.64.94.142:3000',
      'https://odisca.co.kr',
    ];
    const origin = req.headers.origin;
    if (Origins.includes(origin)) {
      res.setHeader(
        'Set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain=.odisca.store; SameSite=None; Secure; httpOnly;`,
      );
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }

  // 관리자 restore
  restoreAccessTokenForAdminister({ administer }): string {
    return this.getAccessTokenForAdminister({ administer: administer.id });
  }

  // 유저 로그아웃
  async blackListUser({ context }) {
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
      const decodedAcc = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_KEY_USER,
        {
          complete: true,
        },
      ) as jwt.JwtPayload;
      // refreshToken 검증
      const decodeRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY_USER,
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

  // 관리자 로그아웃
  async blackListAdminister({ context }) {
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
      const decodedAcc = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_KEY_ADMINISTER,
        {
          complete: true,
        },
      ) as jwt.JwtPayload;
      // refreshToken 검증
      const decodeRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY_ADMINISTER,
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

  // sms 인증번호 전송
  async sendVerificationCodeBySMS({ phone }) {
    const sms = coolsms;
    const messageService = new sms(process.env.SMS_KEY, process.env.SMS_SECRET);
    try {
      await messageService.sendOne({
        to: phone,
        from: process.env.SMS_SENDER,
        text: `[odisca] 인증번호는 ${verificationCode}입니다`,
        autoTypeDetect: true,
      });
      await this.cacheManager.set(
        `verificationToken:${verificationCode}`,
        verificationCode,
        {
          ttl: 180,
        },
      );
    } catch (error) {
      throw new NotAcceptableException(error);
    }
    return `인증번호:${verificationCode} 전송완료`;
  }

  // sms 인증번호 인증
  async checkVerificationCodeBySMS({ verificationCode }) {
    const savedVerificationCode = await this.cacheManager.get(
      `verificationToken:${verificationCode}`,
    );
    if (verificationCode !== savedVerificationCode)
      throw new UnauthorizedException('인증실패');
    return '인증완료';
  }
}
