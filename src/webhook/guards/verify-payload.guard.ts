import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { createHmac } from 'crypto';

@Injectable()
export class VerifyPayload implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    try {
      const rawData = Buffer.from(request.body).toString('utf8');
      const incomingSignature = request.headers['x-hub-signature'] as string;

      if (
        incomingSignature &&
        incomingSignature.length === 45 &&
        incomingSignature.substring(0, 5) === 'sha1='
      ) {
        const appSecret = this.configService.get('APP_SECRET');
        const signature = createHmac('sha1', appSecret)
          .update(rawData)
          .digest('hex');

        return signature === incomingSignature.substring(5);
      }
    } catch (error) {
      throw new BadRequestException('PAYLOAD_OR_SIGNATURE_INVALID');
    }
  }
}
