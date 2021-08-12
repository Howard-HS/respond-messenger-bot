import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { MessageModule } from './message/message.module';
import { ProductModule } from './product/product.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [WebhookModule, MessageModule, ProductModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
