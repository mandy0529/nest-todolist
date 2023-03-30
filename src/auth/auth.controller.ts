import { AuthService } from './auth.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // signup
  @Post('signup')
  signup() {
    return this.authService.signup();
  }

  // signin
  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
