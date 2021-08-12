import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as initEnvs } from 'dotenv';

initEnvs();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
