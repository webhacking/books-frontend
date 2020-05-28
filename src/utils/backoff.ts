export class CancelledError extends Error {
  constructor(public inner?: Error) {
    super('Retry cancelled');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CancelledError);
    }
    this.name = this.constructor.name;
  }
}

interface ExpBackoffOptions {
  maxRetries?: number;
  backoffTimeUnit?: number;
}

const DEFAULT_MAX_RETRIES = Infinity;
const DEFAULT_TIME_UNIT = 100;

export function runWithExponentialBackoff<T>(
  factory: () => Promise<T>,
  options?: ExpBackoffOptions,
): Promise<T> {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    backoffTimeUnit = DEFAULT_TIME_UNIT,
  } = options || {};
  let count = 0;
  function runOnce(): Promise<T> {
    return factory().catch((err) => {
      if (err instanceof CancelledError) {
        return Promise.reject(err);
      }
      const window = 2 ** count;
      count += 1;
      if (count >= maxRetries) {
        return Promise.reject(err);
      }
      const windowIdx = Math.floor(Math.random() * window) + window;
      return new Promise((resolve) => setTimeout(resolve, windowIdx * backoffTimeUnit))
        .then(runOnce);
    });
  }
  return runOnce();
}
