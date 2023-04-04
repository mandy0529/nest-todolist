import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppController } from './../src/app.controller';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';
import { PrismaService } from './../src/prisma/prisma.service';

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
  it.todo('should pass');
  it.todo('should pass2');

  // stopping logic
  afterAll(() => {
    app.close();
  });
});
