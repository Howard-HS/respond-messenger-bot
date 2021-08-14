import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './model/customer.entity';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {}

  findOne(psid: string) {
    return this.repo.findOne({ psid });
  }

  create(psid: string) {
    const customer = this.repo.create({ psid });
    return this.repo.save(customer);
  }
}
