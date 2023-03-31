import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  // signup
  signup(dto: AuthDto) {
    return dto;
  }
  // signin
  signin() {
    return 'ready for signin';
  }
}
