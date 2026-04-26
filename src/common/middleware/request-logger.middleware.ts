import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

type RequestWithId = Request & {
  requestId?: string;
};

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: RequestWithId, res: Response, next: NextFunction): void {
    const startedAt = Date.now();
    const incomingRequestId = req.headers['x-request-id'];
    const requestId =
      typeof incomingRequestId === 'string' && incomingRequestId.trim()
        ? incomingRequestId
        : randomUUID();

    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    const { method, originalUrl } = req;

    this.logger.log(`[${requestId}] ${method} ${originalUrl} - started`);

    res.on('finish', () => {
      const duration = Date.now() - startedAt;
      const { statusCode } = res;

      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
