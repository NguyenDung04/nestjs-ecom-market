export function sanitizeKeyword(value?: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const sanitized = value.trim().replace(/\s+/g, ' ');

  return sanitized.length > 0 ? sanitized : undefined;
}

export function sanitizeOptionalInt(value?: unknown): number | undefined {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

export function sanitizeSlugInput(value?: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const sanitized = value.trim().toLowerCase();

  return sanitized.length > 0 ? sanitized : undefined;
}

export function sanitizeBoolean(value?: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  return undefined;
}

export function sanitizePositiveInt(
  value?: unknown,
  fallback = 1,
  min = 1,
  max = 100,
): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return fallback;
  }

  if (parsed < min) {
    return min;
  }

  if (parsed > max) {
    return max;
  }

  return parsed;
}

export function sanitizeSortOrder(value?: unknown): 'ASC' | 'DESC' {
  if (typeof value !== 'string') {
    return 'DESC';
  }

  return value.trim().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
}

export function sanitizeSortField<T extends string>(
  value: unknown,
  allowedFields: readonly T[],
  fallback: T,
): T {
  if (typeof value !== 'string') {
    return fallback;
  }

  return allowedFields.includes(value as T) ? (value as T) : fallback;
}
