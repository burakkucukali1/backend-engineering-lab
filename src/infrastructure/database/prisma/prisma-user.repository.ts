import type { PrismaClient, Prisma } from "../../../generated/prisma/client.js";

import { User } from "../../../domain/entities/user.entity.js";

import type {
  CreateUserData,
  UserRepository,
} from "../../../domain/repositories/user.repository.js";

type PrismaUser = Prisma.UserGetPayload<{}>;

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUserData): Promise<User> {
    const record = await this.prisma.user.create({
      data,
    });

    return this.toDomain(record);
  }

  async findById(id: number): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  private toDomain(record: PrismaUser): User {
    return new User({
      id: record.id,
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}