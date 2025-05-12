import { validate as uuidValidate } from "uuid";
import { CreateUserDto, UpdateUserDto } from "../types/user.types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateUUID(id: string): boolean {
  return uuidValidate(id);
}

export function validateCreateUserDto(data: any): CreateUserDto {
  if (!data) {
    throw new ValidationError("Request body is required");
  }

  if (!data.username || typeof data.username !== "string") {
    throw new ValidationError("username is required and must be a string");
  }

  if (
    data.age === undefined ||
    typeof data.age !== "number" ||
    isNaN(data.age)
  ) {
    throw new ValidationError("age is required and must be a number");
  }

  if (!Array.isArray(data.hobbies)) {
    throw new ValidationError("hobbies must be an array");
  }

  if (data.hobbies.some((hobby: any) => typeof hobby !== "string")) {
    throw new ValidationError("each hobby must be a string");
  }

  return {
    username: data.username,
    age: data.age,
    hobbies: data.hobbies,
  };
}

export function validateUpdateUserDto(data: any): UpdateUserDto {
  if (!data) {
    throw new ValidationError("Request body is required");
  }

  const updateDto: UpdateUserDto = {};

  if (data.username !== undefined) {
    if (typeof data.username !== "string") {
      throw new ValidationError("username must be a string");
    }
    updateDto.username = data.username;
  }

  if (data.age !== undefined) {
    if (typeof data.age !== "number" || isNaN(data.age)) {
      throw new ValidationError("age must be a number");
    }
    updateDto.age = data.age;
  }

  if (data.hobbies !== undefined) {
    if (!Array.isArray(data.hobbies)) {
      throw new ValidationError("hobbies must be an array");
    }

    if (data.hobbies.some((hobby: any) => typeof hobby !== "string")) {
      throw new ValidationError("each hobby must be a string");
    }

    updateDto.hobbies = data.hobbies;
  }

  return updateDto;
}
