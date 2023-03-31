import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  // signup
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

      // password 빼기
      delete user.password;
      return user;
    } catch (error) {
      // 에러가 있을 경우 ForbiddenException으로 날려주기
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credential is already taken');
      }
    }
  }
  // signin
  async signin(dto: AuthDto) {
    // find the user by email
    const existUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //  if no user, throw exception
    if (!existUser) {
      throw new ForbiddenException('Credentials incorrect');
    }

    //  compare password
    const isMatchPassword = await argon.verify(
      existUser.password,
      dto.password,
    );

    //  if password incorrect, throw exception
    if (!isMatchPassword) {
      throw new ForbiddenException('Credentials incorrect');
    }

    //  // password 빼기
    delete existUser.password;

    //  send back user
    return existUser;
  }
}
