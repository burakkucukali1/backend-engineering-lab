import type { User } from "../entities/user.entity.js";

export interface UserCredentials {
  user: User;
  passwordHash: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findCredentialsByEmail(email: string): Promise<UserCredentials | null>;
  findAll(skip: number, take: number): Promise<User[]>;
  count(): Promise<number>;
  update(id: number, data: UpdateUserData): Promise<User>;
}
