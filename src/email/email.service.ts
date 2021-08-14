import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import { Product } from '../product/models/product.entity';
import { Customer } from '../customer/model/customer.entity';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      secure: true,
      host: this.configService.get('EMAIL_HOST'),
      port: Number(this.configService.get('EMAIL_PORT')),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async send(email: string, subject: string, content: string) {
    return this.transporter.sendMail({
      to: email,
      from: `${this.configService.get('EMAIL_SENDER')}<${this.configService.get(
        'EMAIL_SENDER_DOMAIN',
      )}>`,
      subject,
      html: content,
    });
  }

  async sendNotification(customer: Customer, product: Product) {
    const template = await readFile(
      join(__dirname, 'templates', 'purchase-details.html'),
      'utf8',
    );

    const html = template
      .replace('{{customerName}}', `${customer.firstname} ${customer.lastname}`)
      .replace('{{customerPsid}}', customer.psid)
      .replace('{{productName}}', product.name)
      .replace('{{productDescription}}', product.description)
      .replace('{{productSku}}', product.sku.toString())
      .replace('{{productType}}', product.type)
      .replace('{{productPrice}}', product.price.toString())
      .replace('{{productShipping}}', product.shipping.toString());

    return this.transporter.sendMail({
      to: this.configService.get('EMAIL_NOTIFICATION_RECEIVER_EMAIL'),
      from: `${this.configService.get('EMAIL_SENDER')}<${this.configService.get(
        'EMAIL_SENDER_DOMAIN',
      )}>`,
      subject: `Customer ${customer.psid} Purchase Intent`,
      html,
    });
  }
}
