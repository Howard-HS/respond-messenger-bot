import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { IncomingWebhookEvent } from './dto/incoming-webhook-event.dto';

@Injectable()
export class WebhookService {
  isSignaturePayloadSame(
    data: IncomingWebhookEvent,
    incomingSignature: string,
  ) {
    const generatedSignature =
      'sha1=' +
      createHmac('sha1', process.env.APP_SECRET)
        .update(JSON.stringify(data))
        .digest('hex');

    return generatedSignature === incomingSignature;
  }
}
