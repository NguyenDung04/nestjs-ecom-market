import { Module } from '@nestjs/common';
import { WebAuthController } from './auth.controller';
import { WebClientController } from './client.controller';
import { WebAdminController } from './admin.controller';
import { WebErrorController } from './error.controller';

@Module({
  controllers: [
    WebAuthController,
    WebClientController,
    WebAdminController,
    WebErrorController,
  ],
})
export class WebModule {}
