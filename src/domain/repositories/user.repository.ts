import type { User } from "../entities/user.entity.js";

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(skip: number, take: number): Promise<User[]>;
  count(): Promise<number>;
}
