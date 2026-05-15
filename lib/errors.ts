import type { ApiError } from '@/types/company';

export class AppError extends Error {
  constructor(
    public code: ApiError['code'],
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
