import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailService } from '../email/email.service';
import { ProductService } from '../product/product.service';
import { MessageService } from './message.service';
import { CustomerService } from '../customer/customer.service';

import { Product } from '../product/models/product.entity';
import { Customer } from '../customer/model/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Customer])],
  providers: [MessageService, EmailService, ProductService, CustomerService],
})
export class MessageModule {}
