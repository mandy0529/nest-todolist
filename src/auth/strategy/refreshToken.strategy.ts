import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

//  refreshToken 대한 jwt/passport 설정해주기 위한 strategy 셋팅
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      //  Authorization을 Bearer로 꺼낸다는 의미
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // secret password
      secretOrKey: config.get('JWT_SECRET'),

      //  refreshToken을 hash해서 pass하게끔 하는작업
      passReqToCallback: true,
    });
  }

  //  진짜 refreshTokenr값 return 해주기
  async validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();

    return { ...payload, refreshToken };
  }
}
