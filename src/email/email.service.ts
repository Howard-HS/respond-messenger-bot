import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      secure: true,
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(email: string, subject: string, content: string) {
    return this.transporter.sendMail({
      to: email,
      from: `${process.env.EMAIL_SENDER}<${process.env.EMAIL_SENDER_DOMAIN}>`,
      subject,
      html: content,
    });
  }
}
