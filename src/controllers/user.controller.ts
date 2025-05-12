import { IncomingMessage, ServerResponse } from "http";
import { db } from "../db/in-memory";
import {
  validateUUID,
  validateCreateUserDto,
  validateUpdateUserDto,
} from "../utils/validation";
import { BadRequestError, NotFoundError } from "../middleware/error.middleware";

const parseBody = async (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }

      try {
        const data = Buffer.concat(chunks).toString();
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new BadRequestError("Invalid JSON in request body"));
      }
    });

    req.on("error", () => {
      reject(new BadRequestError("Error parsing request body"));
    });
  });
};

export async function getAllUsers(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const users = await db.getAllUsers();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(users));
}

export async function getUserById(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  if (!validateUUID(id)) {
    throw new BadRequestError("User ID is invalid (not a UUID)");
  }

  const user = await db.getUserById(id);

  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(user));
}

export async function createUser(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const body = await parseBody(req);
  const userData = validateCreateUserDto(body);

  const newUser = await db.createUser(userData);

  res.statusCode = 201;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(newUser));
}

export async function updateUser(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  if (!validateUUID(id)) {
    throw new BadRequestError("User ID is invalid (not a UUID)");
  }

  const body = await parseBody(req);
  const updateData = validateUpdateUserDto(body);

  const updatedUser = await db.updateUser(id, updateData);

  if (!updatedUser) {
    throw new NotFoundError(`User with id ${id} not found`);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(updatedUser));
}

export async function deleteUser(
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
): Promise<void> {
  if (!validateUUID(id)) {
    throw new BadRequestError("User ID is invalid (not a UUID)");
  }

  const user = await db.getUserById(id);

  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }

  await db.deleteUser(id);

  res.statusCode = 204;
  res.end();
}
