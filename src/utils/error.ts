export class NotFoundError extends Error {
  constructor(public path: string) {
    super(`Not found: ${path}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.name = this.constructor.name;
  }
}
