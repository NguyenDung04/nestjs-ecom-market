import { Module } from '@nestjs/common';
import { ClientViewController } from './client-view.controller';
import { AuthViewController } from './auth-view.controller';
import { AdminViewController } from './admin-view.controller';

@Module({
  controllers: [ClientViewController, AuthViewController, AdminViewController],
})
export class WebModule {}
