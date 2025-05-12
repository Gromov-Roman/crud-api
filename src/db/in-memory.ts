import { v4 as uuidv4 } from "uuid";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserId,
} from "../types/user.types";

class InMemoryDB {
  private users: Map<string, User> = new Map();

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: UserId): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const id = uuidv4();
    const newUser: User = {
      id,
      ...userData,
    };

    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: UserId, userData: UpdateUserDto): Promise<User | null> {
    const existingUser = this.users.get(id);

    if (!existingUser) {
      return null;
    }

    const updatedUser: User = {
      ...existingUser,
      ...userData,
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: UserId): Promise<boolean> {
    return this.users.delete(id);
  }
}

export const db = new InMemoryDB();
