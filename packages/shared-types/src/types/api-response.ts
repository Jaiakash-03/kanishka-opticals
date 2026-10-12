/** Standard API response envelope for all endpoints */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

/** Standard success response */
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
}

/** Standard error response */
export interface ErrorResponse extends ApiResponse<never> {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
