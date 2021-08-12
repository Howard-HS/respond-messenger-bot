import { BadRequestException, Body, Post } from '@nestjs/common';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Get()
  verifyHook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const VERIFY_TOKEN = 'myrandomtoken';

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return challenge;
      }
    } else {
      throw new BadRequestException();
    }
  }

  @Post()
  handleIncomingWebhookEvent(@Body() body: any) {
    if (body.object === 'page') {
      body.entry.forEach((entry) => {
        const webhookEvent = entry.messaging[0];
        console.log(webhookEvent);
      });
      return 'EVENT_RECEIVED';
    }
  }
}
