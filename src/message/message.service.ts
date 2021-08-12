import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class MessageService {
  private sendTextMessage(recipientId: string, text: string) {
    axios.post(
      `https://graph.facebook.com/v11.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      {
        recipient: { id: recipientId },
        message: { text },
      },
    );
  }

  async sendGreetingResponse(recipientId: string) {
    const randomResponses = [
      'How are you? :)',
      `I hope you're doing well. :)`,
      `I hope you're having a great day. :)`,
    ];
    const greetingMessage =
      randomResponses[Math.floor(Math.random() * randomResponses.length)];

    this.sendTextMessage(
      recipientId,
      `${greetingMessage}\nHow can I assist you?`,
    );
  }

  sendGenericResponse(recipientId: string) {
    this.sendTextMessage(
      recipientId,
      `I'm sorry :(\nI don't think I can understand your intention.\nLet me ask for help from our customer service, hang on tight!`,
    );
  }
}
