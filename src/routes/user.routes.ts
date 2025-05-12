import { IncomingMessage, ServerResponse } from "http";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { errorMiddleware } from "../middleware/error.middleware";

export async function userRouter(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const { method, url } = req;

  try {
    if (url === "/api/users") {
      if (method === "GET") {
        await getAllUsers(req, res);
        return true;
      }

      if (method === "POST") {
        await createUser(req, res);
        return true;
      }
    }

    const userIdMatch = url?.match(/^\/api\/users\/([^\/]+)$/);

    if (userIdMatch) {
      const userId = userIdMatch[1];

      if (method === "GET") {
        await getUserById(req, res, userId);
        return true;
      }

      if (method === "PUT") {
        await updateUser(req, res, userId);
        return true;
      }

      if (method === "DELETE") {
        await deleteUser(req, res, userId);
        return true;
      }
    }

    return false;
  } catch (err) {
    errorMiddleware(err as Error, req, res);
    return true;
  }
}
