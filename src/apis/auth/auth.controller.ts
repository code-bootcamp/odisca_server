import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard';
import { IOAuthUser } from './interfaces/auth-service.interface';

// interface IOAuthUser {
//   user: {
//     name: string;
//     email: string;
//     password: string;
//     phone: string;
//   };
// }

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  //유저 소셜로그인
  @Get('/login/:social')
  @UseGuards(DynamicAuthGuard)
  loginUserOAuth(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    req.params;
    console.log(req, res);
    return this.authService.socialUserLogin({ req, res });
  }

  //관리자 소셜로그인
  @Get('/login/:social')
  @UseGuards(DynamicAuthGuard)
  loginAdministerOAuth(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    req.params;
    return this.authService.socialAdministerLogin({ req, res });
  }
}
