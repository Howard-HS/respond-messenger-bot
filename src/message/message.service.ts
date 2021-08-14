import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomerService } from 'src/customer/customer.service';
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
    private readonly customerService: CustomerService,
  ) {}

  private async sendTextMessage(customerPsid: string, text: string) {
    const pageAccessToken = this.configService.get('PAGE_ACCESS_TOKEN');
    try {
      await axios.post(
        `https://graph.facebook.com/v11.0/me/messages?access_token=${pageAccessToken}`,
        {
          recipient: { id: customerPsid },
          message: { text },
        },
      );
    } catch (error) {
      console.log(error.response.data);
    }
  }

  private async sendTemplateMessage(
    customerPsid: string,
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

    try {
      await axios.post(
        `https://graph.facebook.com/v11.0/me/messages?access_token=${pageAccessToken}`,
        {
          recipient: { id: customerPsid },
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
      );
    } catch (error) {
      console.log(error.response.data);
    }
  }

  private async sendGreetingResponse(customerPsid: string) {
    const randomResponses = [
      'How are you? :)',
      `I hope you're doing well. :)`,
      `I hope you're having a great day. :)`,
    ];
    const greetingMessage =
      randomResponses[Math.floor(Math.random() * randomResponses.length)];

    await this.sendTextMessage(
      customerPsid,
      `${greetingMessage}\nHow can I assist you?`,
    );
    await this.sendTextMessage(
      customerPsid,
      'Here are things that I can understand, try typing: \n*/price product-xyz* _Price of a product._\n*/desc product-xyz* _The details of the product._\n*/shipping product-xyz* _The shipping fee of the product._',
    );
  }

  private sendGenericResponse(customerPsid: string) {
    this.sendTextMessage(
      customerPsid,
      `I'm sorry :(\nI'm not sure how to process this.\nLet me ask for help from our customer service, hang on tight!`,
    );
  }

  private sendInstructionsResponse(customerPsid: string) {
    this.sendTextMessage(
      customerPsid,
      `I'm sorry :(\nI don't think I can understand your intention.\n\nHere are things that I can understand, try typing: \n*/price product-xyz* _Price of a product._\n*/desc product-xyz* _The details of the product._\n*/shipping product-xyz* _The shipping fee of the product._`,
    );
  }

  private extractProductId(text: string) {
    return Number(text.split(' ')[1]);
  }

  private async replyWithProductInformation(
    productId: number,
    customerPsid: string,
    intent: string,
  ) {
    const product = await this.productService.findOne(productId);

    if (!product) {
      this.sendTextMessage(
        customerPsid,
        `I'm sorry, the product you're looking for is no longer available, perhaps try another search?`,
      );
      return;
    }

    switch (intent) {
      case 'price-query':
        this.sendTemplateMessage(customerPsid, product, intent);
        break;
      case 'description-query':
        this.sendTemplateMessage(customerPsid, product, intent);
        break;
      case 'shipping-query':
        this.sendTemplateMessage(customerPsid, product, intent);
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
      const customerPsid = webhookEvent.sender.id;

      const existingCustomer = await this.customerService.findOne(customerPsid);

      // If existing customer is not found, send a first time greeting response
      if (!existingCustomer) {
        this.customerService.create(customerPsid);
        this.sendGreetingResponse(customerPsid);
        continue;
      }

      // If incoming webhook event is neither 'messages' event or 'postback' event
      if (!webhookEvent.message && !webhookEvent.postback) {
        this.sendGenericResponse(webhookEvent.sender.id);
        continue;
      }

      // Handles 'message' event
      if (webhookEvent.message) {
        const incomingTextMessage = webhookEvent.message.text;

        if (incomingTextMessage.startsWith('/price ')) {
          this.replyWithProductInformation(
            this.extractProductId(incomingTextMessage),
            customerPsid,
            'price-query',
          );
        } else if (incomingTextMessage.startsWith('/desc ')) {
          this.replyWithProductInformation(
            this.extractProductId(incomingTextMessage),
            customerPsid,
            'description-query',
          );
        } else if (incomingTextMessage.startsWith('/shipping ')) {
          this.replyWithProductInformation(
            this.extractProductId(incomingTextMessage),
            customerPsid,
            'shipping-query',
          );
        } else {
          this.sendInstructionsResponse(webhookEvent.sender.id);
        }
      }

      // Handles 'postback' event
      if (
        webhookEvent.postback &&
        webhookEvent.postback.payload.includes('PURCHASE-INTENT')
      ) {
        const productId = Number(webhookEvent.postback.payload.split('-')[0]);
        const [product, customerDetails] = await Promise.all([
          this.productService.findOne(productId),
          this.customerService.findOne(customerPsid),
        ]);
        this.sendTextMessage(
          customerPsid,
          `Good Choice! We've received your request and will process your order shortly.`,
        );
        this.emailService.sendNotification(customerDetails, product);
      }
    }
  }
}
