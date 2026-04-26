import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('home')
  home() {
    return {
      title: 'Pharma Ecomm Booking',
      message: 'NestJS MVC + REST API is ready',
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
