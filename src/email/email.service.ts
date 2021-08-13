import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

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
}
