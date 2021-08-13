import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EmailService } from 'src/email/email.service';
import { Product } from 'src/product/models/product.entity';
import { ProductService } from 'src/product/product.service';

import { IncomingWebhookData } from 'src/webhook/dto/incoming-webhook-event.dto';
@Injectable()
export class MessageService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
  ) {}

  private sendTextMessage(recipientId: string, text: string) {
    const pageAccessToken = this.configService.get('PAGE_ACCESS_TOKEN');
    axios
      .post(
        `https://graph.facebook.com/v11.0/me/messages?access_token=${pageAccessToken}`,
        {
          recipient: { id: recipientId },
          message: { text },
        },
      )
      .catch((err) => console.log(err.response.data));
  }

  private sendTemplateMessage(
    recipientId: string,
    product: Product,
    intent: string,
  ) {
    const pageAccessToken = this.configService.get('PAGE_ACCESS_TOKEN');
    let subtitle = '';

    if (intent === 'price-query') {
      subtitle = `Selling Price: $${product.price}`;
    } else if (intent === 'description-query') {
      subtitle = product.description;
    } else if (intent === 'shipping-query') {
      subtitle = `Shipping Fee: $${product.price}`;
    }

    axios
      .post(
        `https://graph.facebook.com/v11.0/me/messages?access_token=${pageAccessToken}`,
        {
          recipient: { id: recipientId },
          message: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: [
                  {
                    title: product.name,
                    image_url: product.image,
                    subtitle,
                    buttons: [
                      {
                        type: 'postback',
                        title: 'Buy Now',
                        payload: `${product.id}-PURCHASE-INTENT`,
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      )
      .catch((err) => console.log(err.response.data));
  }

  private async sendGreetingResponse(recipientId: string) {
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

  private sendGenericResponse(recipientId: string) {
    this.sendTextMessage(
      recipientId,
      `I'm sorry :(\nI'm not sure how to process this.\nLet me ask for help from our customer service, hang on tight!`,
    );
  }

  private sendInstructionsResponse(recipientId: string) {
    this.sendTextMessage(
      recipientId,
      `I'm sorry :(\nI don't think I can understand your intention.\n\nHere are things that I can understand, try typing: \n*/price product-xyz* _Price of a product._\n*/desc product-xyz* _The details of the product._\n*/shipping product-xyz* _The shipping fee of the product._`,
    );
  }

  private extractProductId(text: string) {
    return Number(text.split(' ')[1]);
  }

  private async replyWithProductInformation(
    productId: number,
    recipientId: string,
    intent: string,
  ) {
    const product = await this.productService.findOne(productId);

    if (!product) {
      this.sendTextMessage(
        recipientId,
        `I'm sorry, the product you're looking for is no longer available, perhaps try another search?`,
      );
      return;
    }

    switch (intent) {
      case 'price-query':
        this.sendTemplateMessage(recipientId, product, intent);
        break;
      case 'description-query':
        this.sendTemplateMessage(recipientId, product, intent);
        break;
      case 'shipping-query':
        this.sendTemplateMessage(recipientId, product, intent);
        break;
    }
  }

  async processUserIntent(body: IncomingWebhookData) {
    if (body.object !== 'page') {
      return;
    }

    for (const entry of body.entry) {
      // As per FB documentation, messaging property is an array that contains ONLY ONE messaging object
      const webhookEvent = entry.messaging[0];

      console.log(webhookEvent.message.nlp.entities);
      console.log(webhookEvent.message.nlp.traits);

      // Handles 'message' event
      if (webhookEvent.message) {
        const incomingTextMessage = webhookEvent.message.text;

        if (incomingTextMessage === 'hello') {
          this.sendGreetingResponse(webhookEvent.sender.id);
        } else if (incomingTextMessage.startsWith('/price ')) {
          const productId = this.extractProductId(incomingTextMessage);
          const recipientId = webhookEvent.sender.id;
          this.replyWithProductInformation(
            productId,
            recipientId,
            'price-query',
          );
        } else if (incomingTextMessage.startsWith('/desc ')) {
          const productId = this.extractProductId(incomingTextMessage);
          const recipientId = webhookEvent.sender.id;
          this.replyWithProductInformation(
            productId,
            recipientId,
            'description-query',
          );
        } else if (incomingTextMessage.startsWith('/shipping ')) {
          const productId = this.extractProductId(incomingTextMessage);
          const recipientId = webhookEvent.sender.id;
          this.replyWithProductInformation(
            productId,
            recipientId,
            'shipping-query',
          );
        } else {
          this.sendInstructionsResponse(webhookEvent.sender.id);
        }
        // Handles 'postback' event
      } else if (webhookEvent.postback) {
        const productId = webhookEvent.postback.payload.split('-')[0];
        const recipientId = webhookEvent.sender.id;
        this.sendTextMessage(
          recipientId,
          `Good Choice! Tell us your email and we'll drop you a purchase link!`,
        );

        // TODO: Save user PSID into db and save intent
      } else {
        this.sendGenericResponse(webhookEvent.sender.id);
        continue;
      }
    }
  }
}
