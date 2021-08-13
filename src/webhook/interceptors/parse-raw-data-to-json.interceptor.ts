import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class ParseRawDataToJson implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as Request;
    const rawData = Buffer.from(request.body).toString('utf8');

    request.body = JSON.parse(rawData);

    return handler.handle();
  }
}
