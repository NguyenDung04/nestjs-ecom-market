/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { API_MESSAGE } from '../constants/api-message.constant';
import { buildSuccessResponse } from '../utils/response.util';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, unknown>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const request = httpContext.getRequest();

    return next.handle().pipe(
      map((originalData) => {
        if (
          originalData &&
          typeof originalData === 'object' &&
          'success' in (originalData as Record<string, unknown>) &&
          'statusCode' in (originalData as Record<string, unknown>)
        ) {
          return originalData;
        }

        let message: string = API_MESSAGE.SUCCESS;
        let data = originalData;
        let meta: Record<string, unknown> | undefined;

        if (
          originalData &&
          typeof originalData === 'object' &&
          'message' in (originalData as Record<string, unknown>) &&
          'data' in (originalData as Record<string, unknown>)
        ) {
          const typed = originalData as {
            message: string;
            data: unknown;
            meta?: Record<string, unknown>;
          };

          message = typed.message || API_MESSAGE.SUCCESS;
          data = typed.data;
          meta = typed.meta;
        }

        return buildSuccessResponse({
          statusCode: response.statusCode,
          message,
          data,
          path: request.originalUrl || request.url,
          meta,
        });
      }),
    );
  }
}
