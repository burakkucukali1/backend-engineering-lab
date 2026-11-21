import type { PrismaClient, Prisma } from "../../../generated/prisma/client.js";

import { User } from "../../../domain/entities/user.entity.js";

import type {
  CreateUserData,
  UpdateUserData,
  UserRepository,
  UserCredentials,
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

  async findAll(skip: number, take: number): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: {
        id: "asc",
      },
    });

    return records.map((record) => this.toDomain(record));
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.toDomain(updatedUser);
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!record || !record.passwordHash) {
      return null;
    }

    return {
      user: this.toDomain(record),
      passwordHash: record.passwordHash,
    };
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
