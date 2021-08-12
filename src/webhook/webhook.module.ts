import { Module } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, MessageService],
})
export class WebhookModule {}
