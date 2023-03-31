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
  signin() {
    return 'ready for signin';
  }
}
