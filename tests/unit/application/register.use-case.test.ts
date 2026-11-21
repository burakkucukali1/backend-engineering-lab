import { describe, it, expect, vi } from "vitest";

import { RegisterUseCase } from "../../../src/application/use-cases/auth/register.use-case.js";
import { UserAlreadyExistsError } from "../../../src/application/errors/user-already-exists.error.js";

import type { UserRepository } from "../../../src/domain/repositories/user.repository.js";
import type { PasswordHasher } from "../../../src/application/ports/password-hasher.js";
import { User } from "../../../src/domain/entities/user.entity.js";

describe("RegisterUseCase", () => {
  const registerData = {
    email: "burak@example.com",
    firstName: "Burak",
    lastName: "Yilmaz",
    password: "MyPassword123!",
  };

  it("should register a new user with a hashed password", async () => {
    const hashedPassword = "$argon2id$hashed-password";

    const createdUser = new User({
      id: 1,
      email: registerData.email,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userRepository: UserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(createdUser),
      findById: vi.fn(),
      findAll: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    };

    const passwordHasher: PasswordHasher = {
      hash: vi.fn().mockResolvedValue(hashedPassword),
      verify: vi.fn(),
    };

    const useCase = new RegisterUseCase(userRepository, passwordHasher);

    const result = await useCase.execute(registerData);

    expect(result.email).toBe(registerData.email);

    expect(passwordHasher.hash).toHaveBeenCalledWith(registerData.password);

    expect(userRepository.create).toHaveBeenCalledWith({
      email: registerData.email,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      passwordHash: hashedPassword,
    });
  });

  it("should reject registration when email already exists", async () => {
    const existingUser = new User({
      id: 1,
      email: registerData.email,
      firstName: "Burak",
      lastName: "Yilmaz",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userRepository: UserRepository = {
      findByEmail: vi.fn().mockResolvedValue(existingUser),
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    };

    const passwordHasher: PasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    };

    const useCase = new RegisterUseCase(userRepository, passwordHasher);

    await expect(useCase.execute(registerData)).rejects.toThrow(
      UserAlreadyExistsError,
    );

    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
