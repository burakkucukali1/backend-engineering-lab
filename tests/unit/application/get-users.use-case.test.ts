import { describe, it, expect, vi } from "vitest";

import { GetUsersUseCase } from "../../../src/application/use-cases/user/get-users.use-case.js";

import type { UserRepository } from "../../../src/domain/repositories/user.repository.js";
import { User } from "../../../src/domain/entities/user.entity.js";

describe("GetUsersUseCase", () => {
  it("should return paginated users", async () => {
    const users = [
      new User({
        id: 1,
        email: "burak@example.com",
        firstName: "Burak",
        lastName: "Kucukali",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new User({
        id: 2,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    const userRepository: UserRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn().mockResolvedValue(users),
      count: vi.fn().mockResolvedValue(25),
    };

    const useCase = new GetUsersUseCase(userRepository);

    const result = await useCase.execute({
      page: 1,
      limit: 2,
    });

    expect(result.users).toEqual(users);

    expect(result.pagination).toEqual({
      page: 1,
      limit: 2,
      total: 25,
      totalPages: 13,
    });

    expect(userRepository.findAll).toHaveBeenCalledWith(0, 2);
    expect(userRepository.count).toHaveBeenCalled();
  });
});
