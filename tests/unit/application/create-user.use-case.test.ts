import { describe, it, expect, vi } from "vitest";

import { CreateUserUseCase } from "../../../src/application/use-cases/user/create-user.use-case.js";
import { UserAlreadyExistsError } from "../../../src/application/errors/user-already-exists.error.js";

import type { UserRepository } from "../../../src/domain/repositories/user.repository.js";
import { User } from "../../../src/domain/entities/user.entity.js";
import { USER_ROLES } from "../../../src/domain/enums/user-role.js";

describe("CreateUserUseCase", () => {
  const createUserData = {
    email: "burak@example.com",
    firstName: "Burak",
    lastName: "Kucukali",
  };

  const createMockUser = () =>
    new User({
      id: 1,
      ...createUserData,
      role: USER_ROLES.CUSTOMER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const createUserRepositoryMock = (): UserRepository => ({
    findByEmail: vi.fn().mockResolvedValue(null),
    findCredentialsByEmail: vi.fn(),
    create: vi.fn().mockResolvedValue(createMockUser()),
    findById: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  });

  it("should create a user when email does not exist", async () => {
    const userRepository = createUserRepositoryMock();

    const useCase = new CreateUserUseCase(userRepository);

    const result = await useCase.execute(createUserData);

    expect(result.email).toBe(createUserData.email);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      createUserData.email,
    );
    expect(userRepository.create).toHaveBeenCalledWith(createUserData);
  });

  it("should throw an error when email already exists", async () => {
    const userRepository = createUserRepositoryMock();

    vi.mocked(userRepository.findByEmail).mockResolvedValue(createMockUser());

    const useCase = new CreateUserUseCase(userRepository);

    await expect(useCase.execute(createUserData)).rejects.toThrow(
      UserAlreadyExistsError,
    );

    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
