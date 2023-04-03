import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

  async validate(payload: any) {
    return payload;
  }
}
