import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

//  jwt accessToken type
type JwtPayload = {
  sub: string;
  email: string;
};

//  accessToken에 대한 jwt/passport 설정해주기 위한 strategy 셋팅
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      //  Authorization을 Bearer로 꺼낸다는 의미
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // secret password
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  //  그자체 payload 반환
  async validate(payload: JwtPayload) {
    return payload;
  }
}
