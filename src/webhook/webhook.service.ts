import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import axios from 'axios';
import { IncomingWebhookEvent } from './dto/incoming-webhook-event.dto';

@Injectable()
export class WebhookService {
  async sendResponse(recipientId: string) {
    const randomResponses = [
      'How are you?',
      `I hope you're doing well.`,
      `I hope you're having a great day.`,
    ];
    const greetingMessage =
      randomResponses[Math.floor(Math.random() * randomResponses.length)];

    await axios.post(
      `https://graph.facebook.com/v11.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      {
        recipient: {
          id: recipientId,
        },
        message: {
          text: greetingMessage,
        },
      },
    );
  }

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
