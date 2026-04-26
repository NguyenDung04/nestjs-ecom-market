export class ApiSuccessResponseDto<T = unknown> {
  success!: true;
  statusCode!: number;
  message!: string;
  data!: T;
  meta?: {
    timestamp: string;
    path?: string;
    [key: string]: unknown;
  };
}
