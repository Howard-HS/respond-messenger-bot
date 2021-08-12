import { Injectable } from '@nestjs/common';
import axios from 'axios';

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
}
