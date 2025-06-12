import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomLoggerService } from '../services/logger.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private httpAdapterHost: HttpAdapterHost,
    private loggerService: CustomLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    this.loggerService.error(
      `Exception: ${JSON.stringify(responseBody)}`,
      exception instanceof Error ? exception.stack : undefined,
      `${request.method} ${request.url}`,
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
