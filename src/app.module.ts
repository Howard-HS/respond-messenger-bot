import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './product/models/product.entity';
import { WebhookModule } from './webhook/webhook.module';
import { MessageModule } from './message/message.module';
import { ProductModule } from './product/product.module';
import { EmailModule } from './email/email.module';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/model/customer.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => {
        return {
          type: 'sqlite',
          database: 'db.sqlite',
          synchronize: true,
          entities: [Product, Customer],
        };
      },
    }),
    WebhookModule,
    MessageModule,
    ProductModule,
    EmailModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
