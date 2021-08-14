import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailService } from '../email/email.service';
import { MessageService } from '../message/message.service';
import { ProductService } from '../product/product.service';
import { WebhookService } from './webhook.service';
import { CustomerService } from '../customer/customer.service';

import { WebhookController } from './webhook.controller';

import { Product } from '../product/models/product.entity';
import { Customer } from '../customer/model/customer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Product, Customer])],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    MessageService,
    EmailService,
    ProductService,
    CustomerService,
  ],
})
export class WebhookModule {}
