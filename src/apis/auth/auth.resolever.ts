import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { IContext } from 'src/common/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginAdministerInput } from './dto/login-administer.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  // 본인인증번호 이메일 전송
  @Mutation(() => String)
  sendVerificationCode(
    @Args('email') email: string, //
  ): Promise<string> {
    return this.authService.sendVerificationCode({ email });
  }

  // 인증번호 체크
  @Mutation(() => String)
  checkVerificationCode(
    @Args('verificationCode') verificationCode: string, //
  ): Promise<string> {
    return this.authService.checkVerificationCode({ verificationCode });
  }

  // 유저 로그인
  @Mutation(() => String)
  LoginUser(
    @Args('loginUserInput') loginUserInput: LoginUserInput, //
    @Context() context: IContext, //
  ): Promise<string> {
    return this.authService.loginUser({ loginUserInput, context });
  }

  // 관리자 로그인
  @Mutation(() => String)
  LoginAdminister(
    @Args('loginAdministerInput') loginAdministerInput: LoginAdministerInput, //
    @Context() context: IContext, //
  ): Promise<string> {
    return this.authService.loginAdminister({ loginAdministerInput, context });
  }

  // 유저 access토큰 재발급
  @UseGuards(GqlAuthGuard('user-refresh'))
  @Mutation(() => String)
  restoreAccessTokenForUser(
    @Context() context: IContext, //
  ): string {
    const user = context.req.user;
    return this.authService.restoreAccessTokenForUser({ user });
  }

  // 관리자 access토큰 재발급
  @UseGuards(GqlAuthGuard('administer-refresh'))
  @Mutation(() => String)
  restoreAccessTokenForAdminister(
    @Context() context: IContext, //
  ): string {
    const administer = context.req.user;
    return this.authService.restoreAccessTokenForAdminister({ administer });
  }

  // 로그아웃 유저
  @Mutation(() => String)
  logoutUser(
    @Context() context: IContext, //
  ) {
    return this.authService.blackListUser({ context });
  }

  // 로그아웃 관리자
  @Mutation(() => String)
  logoutAdminister(
    @Context() context: IContext, //
  ) {
    return this.authService.blackListAdminister({ context });
  }
}
