import { Tokens } from './types';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // signup
  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  // signin
  @Post('signin')
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  // logout
  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  // refreshtoken
  @Post('refreshToken')
  refreshToken() {
    return this.authService.refreshToken();
  }
}
