import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductService } from './product.service';
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService],
})
export class ProductModule {}
