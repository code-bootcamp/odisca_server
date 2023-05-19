import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { IContext } from 'src/common/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  // 본인인증번호 이메일 전송
  @Mutation(() => String)
  sendVerificationCode(@Args('email') email: string) {
    return this.authService.sendVerificationCode({ email });
  }

  // 인증번호 체크
  @Mutation(() => String)
  checkVerificationCode(@Args('verificationCode') verificationCode: string) {
    return this.authService.checkVerificationCode({ verificationCode });
  }

  // 유저 로그인
  @Mutation(() => String)
  LoginUser(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.loginUser({ loginInput, context });
  }

  // 유저 로그인
  @Mutation(() => String)
  LoginAdminister(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.loginAdminister({ loginInput, context });
  }

  // access토큰 재발급
  @UseGuards(GqlAuthGuard('refresh'))
  @Mutation(() => String)
  restoreAccessToken(@Context() context: IContext): string {
    const user = context.req.user;
    return this.authService.restoreAccessToken({ user });
  }

  // 로그아웃
  @Mutation(() => String)
  logout(@Context() context: IContext) {
    return this.authService.blackList({ context });
  }
}
