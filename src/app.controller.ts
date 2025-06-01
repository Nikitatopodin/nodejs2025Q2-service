import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get greetings' })
  @ApiResponse({ status: 200, description: 'App greetings you!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
