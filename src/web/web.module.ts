import { Module } from '@nestjs/common';
import { ClientViewController } from './client-view.controller';
import { AuthViewController } from './auth-view.controller';
import { AdminViewController } from './admin-view.controller';
import { WebAuthGuard } from './guards/web-auth.guard';
import { WebAdminGuard } from './guards/web-admin.guard';
import { JwtModule } from '@nestjs/jwt';
import { ErrorViewController } from './error-view.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [
    ClientViewController,
    AuthViewController,
    AdminViewController,
    ErrorViewController,
  ],
  providers: [WebAuthGuard, WebAdminGuard],
})
export class WebModule {}
