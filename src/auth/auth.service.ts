import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  //  1. create token
  async createToken(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      // accessToken
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          // 15 mins
          expiresIn: 60 * 15,
          secret: this.config.get('JWT_SECRET'),
        },
      ),
      //  refreshToken
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          //  1 week
          expiresIn: 60 * 60 * 24 * 7,
          secret: this.config.get('JWT_SECRET'),
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  //  2. createHashRefreshToken
  async createHashRefreshToken(userId: string, refreshToken: string) {
    // refreshtoken을 한번더 hash해주기
    const hashRefreshToken = await argon.hash(refreshToken);

    //  우리의 prisma에 update해주기
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashRefreshToken,
      },
    });
  }

  // 3. signup
  async signup(dto: AuthDto) {
    //  password hashed
    const hashPassword = await argon.hash(dto.password);

    try {
      //  create user to prisma
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashPassword,
        },
      });

      //  token 발행
      const tokens = await this.createToken(user.id, user.email);

      //  create hashRefreshToken
      await this.createHashRefreshToken(user.id, tokens.refreshToken);

      //  send back tokens
      return tokens;
    } catch (error) {
      // 에러가 있을 경우 ForbiddenException으로 날려주기
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credential is already taken');
      }
    }
  }
  // 4. signin
  async signin(dto: AuthDto): Promise<Tokens> {
    // find the user by email
    const existUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //  if no user, throw exception
    if (!existUser) {
      throw new ForbiddenException('Access denied');
    }

    //  compare password
    const isMatchPassword = await argon.verify(
      existUser.password,
      dto.password,
    );

    //  if password incorrect, throw exception
    if (!isMatchPassword) {
      throw new ForbiddenException('Access denied');
    }

    //  create accessToken, refreshToken
    const tokens = await this.createToken(existUser.id, existUser.email);

    //  create hashrefreshtoken
    await this.createHashRefreshToken(existUser.id, tokens.refreshToken);

    //  send back user
    return tokens;
  }

  // logout
  logout() {
    return 'logout';
  }

  // refresh token
  refreshToken() {
    return 'refresh token';
  }
}
