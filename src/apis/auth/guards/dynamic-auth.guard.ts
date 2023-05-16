import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

class GoogleAuthGuard extends AuthGuard('google') {}
class KakaoAuthGuard extends AuthGuard('kakao') {}
class NaverAuthGuard extends AuthGuard('naver') {}

const DYNAMIC_AUTH_GUARD = {
  google: new GoogleAuthGuard(),
  kakao: new KakaoAuthGuard(),
  naver: new NaverAuthGuard(),
};

export class DynamicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { social } = context.switchToHttp().getRequest().params;
    return DYNAMIC_AUTH_GUARD[social].canActivate(context);
  }
}
