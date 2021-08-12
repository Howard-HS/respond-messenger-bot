import {
  BadRequestException,
  Body,
  Post,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { Controller, Get, Query } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { IncomingWebhookEvent } from './dto/incoming-webhook-event.dto';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private webhookService: WebhookService,
    private messageService: MessageService,
  ) {}

  @Get()
  verifyHook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return challenge;
      }
    } else {
      throw new BadRequestException();
    }
  }

  @Post()
  @HttpCode(200)
  async handleIncomingWebhookEvent(
    @Body() body: any,
    @Headers('X-Hub-Signature') incomingSignature: string,
  ) {
    if (
      incomingSignature &&
      incomingSignature.length === 45 &&
      incomingSignature.substring(0, 5) === 'sha1=' &&
      this.webhookService.isSignaturePayloadSame(body, incomingSignature)
    ) {
      // Process user intent here
      if (body.object === 'page') {
        for (const entry of body.entry) {
          // As per FB documentation, messaging property is an array that contains ONLY ONE messaging object
          const webhookEvent = entry.messaging[0];

          // Current implementation only support 'messages' event
          if (webhookEvent.message && webhookEvent.message.text === 'hello') {
            this.messageService.sendGreetingResponse(webhookEvent.sender.id);
          } else {
            this.messageService.sendGenericResponse(webhookEvent.sender.id);
          }
        }
      }
    }
  }
}
