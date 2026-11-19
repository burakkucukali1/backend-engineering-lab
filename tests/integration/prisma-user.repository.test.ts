import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { prisma } from "../../src/infrastructure/database/prisma/client.js";
import { PrismaUserRepository } from "../../src/infrastructure/database/prisma/prisma-user.repository.js";

describe("PrismaUserRepository", () => {
  const userRepository = new PrismaUserRepository(prisma);

  const testEmail = `test-${Date.now()}@example.com`;

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });

    await prisma.$disconnect();
  });

  it("should create a user", async () => {
    const user = await userRepository.create({
      email: testEmail,
      firstName: "Test",
      lastName: "User",
    });

    expect(user.id).toBeGreaterThan(0);
    expect(user.email).toBe(testEmail);
    expect(user.fullName).toBe("Test User");
  });

  it("should find a user by email", async () => {
    const user = await userRepository.findByEmail(testEmail);

    expect(user).not.toBeNull();
    expect(user?.email).toBe(testEmail);
  });

  it("should find a user by id", async () => {
    const createdUser = await userRepository.findByEmail(testEmail);

    expect(createdUser).not.toBeNull();

    const user = await userRepository.findById(createdUser!.id);

    expect(user).not.toBeNull();
    expect(user?.id).toBe(createdUser!.id);
  });

  it("should return null when user does not exist", async () => {
    const user = await userRepository.findByEmail(
      "non-existent-user@example.com",
    );

    expect(user).toBeNull();
  });
});