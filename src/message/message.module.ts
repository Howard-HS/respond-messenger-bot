import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { ProductService } from 'src/product/product.service';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/models/product.entity';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/model/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Customer])],
  providers: [MessageService, EmailService, ProductService, CustomerService],
})
export class MessageModule {}
