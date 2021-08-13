import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { createHmac } from 'crypto';

export class VerifyPayload implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const rawData = Buffer.from(request.body).toString('utf8');
    const incomingSignature = request.headers['x-hub-signature'] as string;

    if (
      incomingSignature &&
      incomingSignature.length === 45 &&
      incomingSignature.substring(0, 5) === 'sha1='
    ) {
      const signature = createHmac('sha1', process.env.APP_SECRET)
        .update(rawData)
        .digest('hex');

      return signature === incomingSignature.substring(5);
    }
  }
}
