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
  maxTries?: number;
  backoffTimeUnit?: number;
  maxBackoffUnits?: number;
}

const DEFAULT_MAX_RETRIES = Infinity;
const DEFAULT_TIME_UNIT = 100;
const DEFAULT_MAX_BACKOFF_UNITS = 80;

export function runWithExponentialBackoff<T>(
  factory: () => Promise<T>,
  options?: ExpBackoffOptions,
): Promise<T> {
  const {
    maxTries: maxRetries = DEFAULT_MAX_RETRIES,
    backoffTimeUnit = DEFAULT_TIME_UNIT,
    maxBackoffUnits = DEFAULT_MAX_BACKOFF_UNITS,
  } = options || {};
  const maxJitterRange = Math.floor(maxBackoffUnits * 0.05);
  let count = 0;
  function runOnce(): Promise<T> {
    return factory().catch((err) => {
      if (err instanceof CancelledError) {
        return Promise.reject(err);
      }
      count += 1;
      if (count >= maxRetries) {
        return Promise.reject(err);
      }
      const jitterRange = Math.min(2 ** (count - 1), maxJitterRange);
      const baseUnits = Math.min(2 ** count, maxBackoffUnits);
      const minUnits = baseUnits - jitterRange;
      const range = jitterRange * 2;
      const unitCount = Math.floor(Math.random() * range) + minUnits;
      return new Promise((resolve) => setTimeout(resolve, unitCount * backoffTimeUnit))
        .then(runOnce);
    });
  }
  return runOnce();
}
