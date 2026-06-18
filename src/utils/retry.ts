import { GitHubAPIError } from '../errors/index.js';
import { logger } from './logging.js';

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const isRateLimit =
        error instanceof GitHubAPIError && error.statusCode === 429;

      if (!isRateLimit || attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn(`Rate limit alcanzado. Reintentando en ${delay}ms...`, { attempt });
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw lastError;
}