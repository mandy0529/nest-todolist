import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe } from 'node:test';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { PrismaService } from './../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  //  starting logic
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    //  app 실행
    await app.init();
    await app.listen(5000);

    //  prisma
    prisma = app.get(PrismaService);

    //  pactum baseUrl setting
    pactum.request.setBaseUrl('http://localhost:5000');
  });

  // test process
  // Auth
  describe('Auth', () => {
    //  dto define
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: 'test',
    };

    //  signup
    describe('signup', () => {
      //  empty email
      it('💡 should throw if email empty', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      //  empty password
      it('💡 should throw if password empty', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      //  empty all fields
      it('💡 should throw if all fields empty', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
          .withBody({})
          .expectStatus(400);
      });

      // credentials already taken or
      it('✅ should throw if credentials already taken ', async () => {
        // existUser from prisma
        const alreadyExistUser = await prisma.user.findUnique({
          where: {
            email: dto.email,
          },
        });

        //  pactum test
        if (alreadyExistUser) {
          return pactum
            .spec()
            .post('/auth/signup')
            .withBody(dto)
            .expectStatus(403);
        }
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    // signin
    describe('signin', () => {
      //  empty email
      it('💡 should throw if email empty', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      //  empty password
      it('💡 should throw if password empty', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      //  empty all fields
      it('💡 should throw if all fields empty', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });

      //  success
      it('✅ signin should pass', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(200)
          .withBody(dto)
          .stores('accessToken', 'accessToken')
          .stores('refreshToken', 'refreshToken');
      });
    });

    // logout
    describe('logout', () => {
      //  no access token
      it('💡 should throw no access token', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/logout')
          .expectStatus(401)
          .withHeaders({});
      });

      //  success
      it('✅ logout should pass', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/logout')
          .withBody(dto)
          .expectStatus(200)
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          });
      });
    });

    //  refreshToken
    describe('refreshToken', () => {
      //  no refresh token
      it('💡 should throw no refresh token', () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/refreshToken')
          .expectStatus(401)
          .withHeaders({});
      });

      //  not match refreshToken
      it('✅ should throw not match refreshToken', async () => {
        //  pactum test
        return pactum
          .spec()
          .post('/auth/refreshToken')
          .expectStatus(403)
          .withHeaders({
            Authorization: 'Bearer $S{refreshToken}',
          });
      });
    });
  });

  // stopping logic
  afterAll(() => {
    app.close();
  });

  it.todo('End should pass');
});
