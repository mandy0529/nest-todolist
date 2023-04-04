import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe } from 'node:test';
import { AppController } from './../src/app.controller';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

describe('app e2e', () => {
  let app: INestApplication;

  //  starting logic
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  // test process
  // Auth
  describe('Auth', () => {
    describe('signup', () => {
      it.todo('signup');
    });
    describe('signin', () => {
      it.todo('signin');
    });
    describe('logout', () => {
      it.todo('logou');
    });
    describe('refreshToken', () => {
      it.todo('refreshtoken');
    });
  });

  // stopping logic
  afterAll(() => {
    app.close();
  });
});
