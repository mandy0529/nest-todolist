import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//  refreshToken guard 셋팅 로직
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  //  refreshToken.strategy.ts에서 jwt 정해줄때 우리가 셋팅했던 name값이 jwt-refresh
  constructor() {
    super();
  }
  // 넘겨줄 dependency가 없으므로 아무것도없다.
}
