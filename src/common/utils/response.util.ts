import { ApiSuccessResponseDto } from '../dto/api-success-response.dto';
import { ApiErrorResponseDto } from '../dto/api-error-response.dto';

export function buildSuccessResponse<T>(params: {
  statusCode: number;
  message: string;
  data: T;
  path?: string;
  meta?: Record<string, unknown>;
}): ApiSuccessResponseDto<T> {
  return {
    success: true,
    statusCode: params.statusCode,
    message: params.message,
    data: params.data,
    meta: {
      timestamp: new Date().toISOString(),
      ...(params.path ? { path: params.path } : {}),
      ...(params.meta || {}),
    },
  };
}

export function buildErrorResponse(params: {
  statusCode: number;
  message: string;
  errors?: string[] | Record<string, unknown> | null;
  path: string;
  requestId?: string;
}): ApiErrorResponseDto {
  return {
    success: false,
    statusCode: params.statusCode,
    message: params.message,
    errors: params.errors ?? null,
    path: params.path,
    timestamp: new Date().toISOString(),
    requestId: params.requestId,
  };
}
