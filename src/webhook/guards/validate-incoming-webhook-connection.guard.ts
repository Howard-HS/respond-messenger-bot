import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ValidateIncomingWebhookConnection implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const mode = request.query['hub.mode'];
    const token = request.query['hub.verify_token'];

    return (
      mode === 'subscribe' && token === this.configService.get('VERIFY_TOKEN')
    );
  }
}
