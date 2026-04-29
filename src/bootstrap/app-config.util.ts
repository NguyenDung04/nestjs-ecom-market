import { ConfigService } from '@nestjs/config';

export function getBooleanConfig(
  configService: ConfigService,
  key: string,
  defaultValue: boolean,
): boolean {
  const value = configService.get<string>(key);

  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  return value === 'true';
}

export function getNumberConfig(
  configService: ConfigService,
  key: string,
  defaultValue: number,
): number {
  const value = Number(configService.get<string>(key));

  if (Number.isNaN(value)) {
    return defaultValue;
  }

  return value;
}
