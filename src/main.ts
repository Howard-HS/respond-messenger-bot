import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as initEnvs } from 'dotenv';
import bodyParser from 'body-parser';

initEnvs();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.use(
    bodyParser.raw({
      type: 'application/json',
    }),
  );
  await app.listen(3000);
}
bootstrap();
