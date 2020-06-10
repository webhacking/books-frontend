export class NotFoundError extends Error {
  public readonly statusCode = 404;

  constructor(public path: string) {
    super(`Not found: ${path}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.name = this.constructor.name;
  }
}
