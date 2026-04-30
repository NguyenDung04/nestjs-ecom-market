import { Request } from 'express';
import { JwtPayload } from './jwt-payload.type';

export type AuthRequest = Request & {
  user?: JwtPayload;
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
};
