import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // signup
  signup() {
    return 'ready for signup';
  }
  // signin
  signin() {
    return 'ready for signin';
  }
}
