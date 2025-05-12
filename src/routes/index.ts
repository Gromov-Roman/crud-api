import { IncomingMessage, ServerResponse } from "http";
import { userRouter } from "./user.routes";
import { NotFoundError } from "../middleware/error.middleware";
import { errorMiddleware } from "../middleware/error.middleware";

export async function router(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    res.setHeader("Content-Type", "application/json");

    const isUserRoute = await userRouter(req, res);

    if (!isUserRoute) {
      throw new NotFoundError(`Route ${req.method} ${req.url} not found`);
    }
  } catch (err) {
    errorMiddleware(err as Error, req, res);
  }
}
