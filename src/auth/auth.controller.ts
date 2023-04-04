import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from './../common/guards/refreshToken.guard';

import { GetCurrentUser, Public } from '../common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // signup
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  // signin
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('signin')
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  // logout
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetCurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  // refreshtoken
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
