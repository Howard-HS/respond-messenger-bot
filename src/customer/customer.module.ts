import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerService } from './customer.service';

import { Customer } from './model/customer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [CustomerService],
})
export class CustomerModule {}
