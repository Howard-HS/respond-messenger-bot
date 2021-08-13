import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EmailService } from 'src/email/email.service';
import { ProductService } from 'src/product/product.service';

import { IncomingWebhookData } from 'src/webhook/dto/incoming-webhook-event.dto';
@Injectable()
export class MessageService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
  ) {}

  sendTextMessage(recipientId: string, text: string) {
    const pageAccessToken = this.configService.get('PAGE_ACCESS_TOKEN');
    axios.post(
      `https://graph.facebook.com/v11.0/me/messages?access_token=${pageAccessToken}`,
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

  sendInstructionsResponse(recipientId: string) {
    this.sendTextMessage(
      recipientId,
      `Here are things that I can understand, try typing: \n*/price product-xyz* _Price of a product._\n*/desc product-xyz* _The details of the product._\n*/shipping product-xyz* _The shipping fee of the product._`,
    );
  }

  async processUserIntent(body: IncomingWebhookData) {
    if (body.object !== 'page') {
      return;
    }

    for (const entry of body.entry) {
      // As per FB documentation, messaging property is an array that contains ONLY ONE messaging object
      const webhookEvent = entry.messaging[0];

      // Current implementation only support 'messages' event
      if (!webhookEvent.message) {
        this.sendGenericResponse(webhookEvent.sender.id);
        continue;
      }

      if (webhookEvent.message.text === 'hello') {
        this.sendGreetingResponse(webhookEvent.sender.id);
      } else if (webhookEvent.message.text.startsWith('/price')) {
        const productId = webhookEvent.message.text.substring(6);
        // const product = await this.productService.findOne(productId);
        // this.sendTextMessage(webhookEvent.sender.id, `Price: ${product.price}`);
      } else if (webhookEvent.message.text.startsWith('/desc')) {
        const productId = webhookEvent.message.text.substring(6);
        this.sendTextMessage(webhookEvent.sender.id, `Desc: ${productId}`);
      } else if (webhookEvent.message.text.startsWith('/shipping')) {
        const productId = webhookEvent.message.text.substring(6);
        this.sendTextMessage(webhookEvent.sender.id, `Shipping: ${productId}`);
      } else {
        this.sendGenericResponse(webhookEvent.sender.id);
        this.sendInstructionsResponse(webhookEvent.sender.id);
      }
    }
  }
}
