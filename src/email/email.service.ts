import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Product } from 'src/product/models/product.entity';

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

  async sendNotification(customerId: string, product: Product) {
    return this.transporter.sendMail({
      to: this.configService.get('EMAIL_NOTIFICATION_RECEIVER_EMAIL'),
      from: `${this.configService.get('EMAIL_SENDER')}<${this.configService.get(
        'EMAIL_SENDER_DOMAIN',
      )}>`,
      subject: `Customer ${customerId} Purchase Intent`,
      html: '',
    });
  }
}
