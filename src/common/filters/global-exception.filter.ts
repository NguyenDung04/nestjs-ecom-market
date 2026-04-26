/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { API_MESSAGE } from '../constants/api-message.constant';
import { buildErrorResponse } from '../utils/response.util';

type RequestWithId = Request & {
  requestId?: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = API_MESSAGE.INTERNAL_SERVER_ERROR;
    let errors: string[] | Record<string, unknown> | null = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        const responseMessage = responseObj.message;

        if (Array.isArray(responseMessage)) {
          errors = responseMessage as string[];
          message = this.mapMessageByStatus(statusCode);
        } else if (typeof responseMessage === 'string') {
          message = responseMessage;
        } else {
          message = this.mapMessageByStatus(statusCode);
        }

        if ('errors' in responseObj) {
          errors = responseObj.errors as Record<string, unknown>;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || API_MESSAGE.INTERNAL_SERVER_ERROR;
    }

    const requestId = request.requestId;

    const errorResponse = buildErrorResponse({
      statusCode,
      message,
      errors,
      path: request.originalUrl || request.url,
      requestId,
    });

    if (statusCode >= 500) {
      this.logger.error(
        `[${requestId}] [${request.method}] ${request.originalUrl || request.url}`,
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception),
      );
    } else {
      this.logger.warn(
        `[${requestId}] [${request.method}] ${request.originalUrl || request.url} -> ${statusCode} ${message}`,
      );
    }

    response.status(statusCode).json(errorResponse);
  }

  private mapMessageByStatus(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return API_MESSAGE.VALIDATION_FAILED;
      case HttpStatus.UNAUTHORIZED:
        return API_MESSAGE.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return API_MESSAGE.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return API_MESSAGE.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return API_MESSAGE.CONFLICT;
      default:
        return API_MESSAGE.INTERNAL_SERVER_ERROR;
    }
  }
}
