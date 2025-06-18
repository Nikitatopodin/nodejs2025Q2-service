import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from '../services/logger.service';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private loggerService: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query } = request;

    this.loggerService.log(
      `Method: ${method}
      URL: ${url} 
      Query: ${JSON.stringify(query)} 
      Body: ${JSON.stringify(body)}`,
      'Request',
    );

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        this.loggerService.log(
          `Response: Status Code: ${response.statusCode} Data: ${JSON.stringify(data)}`,
          'Response',
        );
      }),
    );
  }
}
