import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 5000;

  //  global validationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      // 해당하는 필드를쓰고, 나머지는 걸러주는 option
      whitelist: true,
      // 해당하지 않은 필드를 썼을때, 걸러주는거 + 에러도 나오게해준다. 이옵션을 쓰기위해서는 whitelist옵션이 true가 되어있어야 사용 가능하다.
      forbidNonWhitelisted: true,
    }),
  );

  // app listening
  await app.listen(port);
  console.log(`✅ Application listening on port ${port}`);
}
bootstrap();
