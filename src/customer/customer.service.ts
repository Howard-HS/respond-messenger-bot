import axios from 'axios';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Customer } from './model/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>,
    private configService: ConfigService,
  ) {}

  private async getCustomerDetails(psid: string) {
    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/${psid}?fields=first_name,last_name,gender&access_token=${this.configService.get(
          'PAGE_ACCESS_TOKEN',
        )}`,
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  findOne(psid: string) {
    return this.repo.findOne({ psid });
  }

  async create(psid: string) {
    const customerDetails = await this.getCustomerDetails(psid);
    const customer = this.repo.create({
      firstname: customerDetails.first_name,
      lastname: customerDetails.last_name,
      gender: customerDetails.gender,
      psid,
    });

    return this.repo.save(customer);
  }
}
