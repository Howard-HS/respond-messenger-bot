import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

import { MessageService } from 'src/message/message.service';
import { ProductService } from 'src/product/product.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/models/product.entity';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/model/customer.entity';
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
