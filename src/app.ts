import { createServer, IncomingMessage, ServerResponse } from "http";
import { router } from "./routes/index";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

export function createApp(port: number) {
  const server = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const next = () => router(req, res);
        loggerMiddleware(req, res, next);
      } catch (err) {
        errorMiddleware(err as Error, req, res);
      }
    },
  );

  server.keepAliveTimeout = 0;
  server.headersTimeout = 5000;

  const start = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
        resolve();
      });

      server.on("error", (err) => {
        console.error("Server start error:", err);
        reject(err);
      });
    });
  };

  const stop = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
          reject(err);
          return;
        }

        server.closeAllConnections();
        resolve();
      });
    });
  };

  return {
    start,
    stop,
    server,
  };
}
