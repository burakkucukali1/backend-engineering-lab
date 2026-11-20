import { describe, it, expect, vi } from "vitest";

import { UpdateUserUseCase } from "../../../src/application/use-cases/user/update-user.use-case.js";
import { UserNotFoundError } from "../../../src/application/errors/user-not-found.error.js";

import type { UserRepository } from "../../../src/domain/repositories/user.repository.js";
import { User } from "../../../src/domain/entities/user.entity.js";

describe("UpdateUserUseCase", () => {
  const updateData = {
    lastName: "Yilmaz",
  };

  it("should update an existing user", async () => {
    const existingUser = new User({
      id: 1,
      email: "burak@example.com",
      firstName: "Burak",
      lastName: "Kucukali",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updatedUser = new User({
      ...{
        id: 1,
        email: "burak@example.com",
        firstName: "Burak",
        lastName: "Yilmaz",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(existingUser),
      update: vi.fn().mockResolvedValue(updatedUser),
      create: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      count: vi.fn(),
    };

    const useCase = new UpdateUserUseCase(userRepository);

    const result = await useCase.execute(1, updateData);

    expect(result.lastName).toBe("Yilmaz");

    expect(userRepository.findById).toHaveBeenCalledWith(1);

    expect(userRepository.update).toHaveBeenCalledWith(1, updateData);
  });

  it("should throw UserNotFoundError when user does not exist", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(null),
      update: vi.fn(),
      create: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      count: vi.fn(),
    };

    const useCase = new UpdateUserUseCase(userRepository);

    await expect(useCase.execute(999, updateData)).rejects.toThrow(
      UserNotFoundError,
    );

    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
