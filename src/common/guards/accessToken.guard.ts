import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

//  accessToken guard 설정 => IsPublic일때는 guard 통과, 아닐떄는 불통 로직
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  //  accessToken.strategy.ts에서 jwt 정해줄때 우리가 셋팅했던 name값이 jwt
  constructor(private refector: Reflector) {
    super();
  }

  // isPublic이라는 키를 가지고있는 아이에게는 true를 넘겨줌으로서 guard를 통과하게 하고
  canActivate(context: ExecutionContext) {
    const isPublic = this.refector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // guard 통과
    if (isPublic) return true;

    //  그외에는 불통하게 걸리게하기
    return super.canActivate(context);
  }
}
