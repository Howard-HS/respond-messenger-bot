import {
  BadRequestException,
  Body,
  Post,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { Controller, Get, Query } from '@nestjs/common';
import { IncomingWebhookEvent } from './dto/incoming-webhook-event.dto';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

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
    @Body() body: IncomingWebhookEvent,
    @Headers('X-Hub-Signature') incomingSignature: string,
  ) {
    if (
      incomingSignature &&
      incomingSignature.length === 45 &&
      incomingSignature.substring(0, 5) === 'sha1=' &&
      this.webhookService.isSignaturePayloadSame(body, incomingSignature)
    ) {
      // Process user intent here
      let recipientid: string;
      if (body.object === 'page') {
        body.entry.forEach((entry) => {
          const webhookEvent = entry.messaging[0];
          console.log(webhookEvent);
          recipientid = webhookEvent.sender.id;
        });

        this.webhookService.sendResponse(recipientid);
      }
    }
  }
}
