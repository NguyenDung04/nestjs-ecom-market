import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from '../constants/pagination.constant';
import {
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
} from '../types/pagination.type';

export function getPaginationParams(
  page?: number,
  limit?: number,
): PaginationParams {
  const safePage = Math.max(Number(page) || DEFAULT_PAGE, 1);

  const safeLimit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  totalItems: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return {
    data,
    meta: buildPaginationMeta(page, limit, totalItems),
  };
}
