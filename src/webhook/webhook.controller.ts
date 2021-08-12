import { BadRequestException, Body, Post, Headers } from '@nestjs/common';
import { Controller, Get, Query } from '@nestjs/common';
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
    const VERIFY_TOKEN = 'myrandomtoken';

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return challenge;
      }
    } else {
      throw new BadRequestException();
    }
  }

  @Post()
  async handleIncomingWebhookEvent(
    @Body() body: any,
    @Headers('X-Hub-Signature') signature: string,
  ) {
    console.log(signature);
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
