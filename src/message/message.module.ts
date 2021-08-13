import { Module } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { MessageService } from './message.service';

@Module({
  providers: [MessageService, EmailService],
})
export class MessageModule {}
