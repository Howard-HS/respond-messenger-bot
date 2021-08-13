import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class ValidateIncomingWebhookConnection implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const mode = request.query['hub.mode'];
    const token = request.query['hub.verify_token'];

    return mode === 'subscribe' && token === process.env.VERIFY_TOKEN;
  }
}
