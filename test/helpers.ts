import http, { IncomingMessage } from "http";
import { REQUEST_TIMEOUT } from "./consts";
import { RequestOptions, Response } from "./types";

export const request = (
  options: RequestOptions,
  data: Record<string, unknown> | null = null,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res: IncomingMessage) => {
      const chunks: Buffer[] = [];

      res.on("data", (chunk: Buffer) => chunks.push(chunk));

      res.on("end", () => {
        const body = chunks.length > 0 ? Buffer.concat(chunks).toString() : "";
        let parsedBody;

        try {
          parsedBody = body ? JSON.parse(body) : {};
        } catch (e) {
          parsedBody = body;
        }

        resolve({
          statusCode: res.statusCode || 0,
          headers: res.headers,
          body: parsedBody,
        });
      });

      res.setTimeout(REQUEST_TIMEOUT, () => {
        req.destroy();
        reject(new Error("Request timed out"));
      });
    });

    req.on("error", (error: Error) => reject(error));

    req.setTimeout(REQUEST_TIMEOUT, () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};
