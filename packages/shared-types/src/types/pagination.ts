/** Pagination query params sent to API */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Pagination metadata returned in API responses */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
