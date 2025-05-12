import { IncomingMessage, ServerResponse } from "http";
import { ValidationError } from "../utils/validation";

export interface HttpError extends Error {
  statusCode: number;
}

export class NotFoundError extends Error implements HttpError {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends Error implements HttpError {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends Error implements HttpError {
  statusCode = 500;
  constructor(message: string = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
  }
}

export function errorMiddleware(
  err: Error,
  req: IncomingMessage,
  res: ServerResponse,
): void {
  console.error(`[Error] ${err.name}: ${err.message}`);

  if (err instanceof ValidationError) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: err.message }));
    return;
  }

  const httpError = err as HttpError;
  if (httpError.statusCode) {
    res.statusCode = httpError.statusCode;
    res.end(JSON.stringify({ message: err.message }));
    return;
  }

  res.statusCode = 500;
  res.end(JSON.stringify({ message: "Internal Server Error" }));
}
