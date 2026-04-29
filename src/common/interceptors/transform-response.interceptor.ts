/* eslint-disable @typescript-eslint/no-unsafe-call */
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

    const accept = request.headers?.accept || '';
    const originalUrl = request.originalUrl || request.url || '';
    const path = request.path || originalUrl;

    const isWebRoute =
      path === '/' ||
      path.startsWith('/auth') ||
      path.startsWith('/admin') ||
      path.startsWith('/products') ||
      path.startsWith('/cart') ||
      path.startsWith('/checkout') ||
      path.startsWith('/orders') ||
      path.startsWith('/profile') ||
      path.startsWith('/contact') ||
      path.startsWith('/error');

    const isHtmlRequest = accept.includes('text/html');

    if (isHtmlRequest || isWebRoute) {
      return next.handle();
    }

    return next.handle().pipe(
      map((originalData) => {
        /*
         * Bảo vệ lần 2:
         * Nếu data trả về có layout thì chắc chắn là dữ liệu render view HBS.
         * Không được bọc response kiểu API.
         */
        if (
          originalData &&
          typeof originalData === 'object' &&
          'layout' in (originalData as Record<string, unknown>)
        ) {
          return originalData;
        }

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
