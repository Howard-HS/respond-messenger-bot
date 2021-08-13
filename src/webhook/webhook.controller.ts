import {
  Body,
  Post,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Controller, Get, Query } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { IncomingWebhookData } from './dto/incoming-webhook-event.dto';
import { ValidateIncomingWebhookConnection } from './guards/validate-incoming-webhook-connection.guard';
import { VerifyPayload } from './guards/verify-payload.guard';
import { ParseRawDataToJson } from './interceptors/parse-raw-data-to-json.interceptor';

@Controller('webhook')
export class WebhookController {
  constructor(private messageService: MessageService) {}

  @Get()
  @UseGuards(ValidateIncomingWebhookConnection)
  verifyHook(@Query('hub.challenge') challenge: string) {
    return challenge;
  }

  @Post()
  @UseGuards(VerifyPayload)
  @UseInterceptors(ParseRawDataToJson)
  @HttpCode(200)
  handleIncomingWebhookEvent(@Body() body: IncomingWebhookData) {
    this.messageService.processUserIntent(body);
  }
}
