import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { ProductService } from 'src/product/product.service';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/models/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [MessageService, EmailService, ProductService],
})
export class MessageModule {}
