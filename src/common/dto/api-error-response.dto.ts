export class ApiErrorResponseDto {
  success!: false;
  statusCode!: number;
  message!: string;
  errors!: string[] | Record<string, unknown> | null;
  path!: string;
  timestamp!: string;
  requestId?: string;
}
