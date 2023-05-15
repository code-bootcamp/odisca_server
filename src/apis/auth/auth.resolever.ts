import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { IContext } from 'src/common/interfaces/context';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  // sms 본인인증 추가하기
  // @Mutation()
  // sendVerificationCode(@Args('phone') phone: string) {
  //   return this.authService.sendVerificationCodeSms({ phone });
  // }

  @Mutation(() => String)
  // 로그인 // 관리자부분 추가 수정하기
  Login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.login({ loginInput, context });
  }
}
