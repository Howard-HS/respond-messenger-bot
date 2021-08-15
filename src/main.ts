import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const configService = app.get<ConfigService>(ConfigService);

  app.use(
    bodyParser.raw({
      type: 'application/json',
    }),
  );
  await app.listen(configService.get('APP_PORT') || 3000);
}
bootstrap();
