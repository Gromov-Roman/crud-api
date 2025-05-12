import { IncomingMessage, ServerResponse } from "http";

export function loggerMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): void {
  const start = Date.now();
  const { method, url } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    console.log(
      `[${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms`,
    );
  });

  next();
}
