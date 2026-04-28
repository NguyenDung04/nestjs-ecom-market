import { Module } from '@nestjs/common';
import { ClientViewService } from './client/client-view.service';
import { AuthViewService } from './auth/auth-view.service';
import { AdminViewService } from './admin/admin-view.service';
import { ClientViewController } from './client/client-view.controller';
import { AuthViewController } from './auth/auth-view.controller';
import { AdminViewController } from './admin/admin-view.controller';

@Module({
  controllers: [ClientViewController, AuthViewController, AdminViewController],
  providers: [ClientViewService, AuthViewService, AdminViewService],
})
export class WebModule {}
