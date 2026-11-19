import { describe, it, expect, vi } from "vitest";

import { CreateUserUseCase } from "../../../src/application/use-cases/user/create-user.use-case.js";
import { UserAlreadyExistsError } from "../../../src/application/errors/user-already-exists.error.js";

import type { UserRepository } from "../../../src/domain/repositories/user.repository.js";
import { User } from "../../../src/domain/entities/user.entity.js";

describe("CreateUserUseCase", () => {
  const createUserData = {
    email: "burak@example.com",
    firstName: "Burak",
    lastName: "Kucukali",
  };

  it("should create a user when email does not exist", async () => {
    const userRepository: UserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(
        new User({
          id: 1,
          ...createUserData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
      findById: vi.fn(),
    };

    const useCase = new CreateUserUseCase(userRepository);

    const result = await useCase.execute(createUserData);

    expect(result.email).toBe(createUserData.email);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      createUserData.email,
    );
    expect(userRepository.create).toHaveBeenCalledWith(createUserData);
  });

  it("should throw an error when email already exists", async () => {
    const existingUser = new User({
      id: 1,
      ...createUserData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userRepository: UserRepository = {
      findByEmail: vi.fn().mockResolvedValue(existingUser),
      create: vi.fn(),
      findById: vi.fn(),
    };

    const useCase = new CreateUserUseCase(userRepository);

    await expect(
      useCase.execute(createUserData),
    ).rejects.toThrow(UserAlreadyExistsError);

    expect(userRepository.create).not.toHaveBeenCalled();
  });
});