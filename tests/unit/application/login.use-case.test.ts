import { describe, it, expect, vi } from "vitest";
import { LoginUseCase } from "../../../src/application/use-cases/auth/login.use-case.js";
import { InvalidCredentialsError } from "../../../src/application/errors/invalid-credentials.error.js";
import type { UserRepository } from "../../../src/domain/repositories/user.repository.js";
import type { PasswordHasher } from "../../../src/application/ports/password-hasher.js";
import type { TokenService } from "../../../src/application/ports/token-service.js";

describe("LoginUseCase", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    createdAt: new Date(),
    updatedAt: new Date(),
    fullName: "Test User",
  };

  it("should return user and access token when credentials are valid", async () => {
    const userRepository = {
      findCredentialsByEmail: vi.fn().mockResolvedValue({
        user: mockUser,
        passwordHash: "hashed-password",
      }),
    } as unknown as UserRepository;

    const passwordHasher = {
      verify: vi.fn().mockResolvedValue(true),
    } as unknown as PasswordHasher;

    const tokenService = {
      generateAccessToken: vi.fn().mockResolvedValue("fake-access-token"),
    } as unknown as TokenService;

    const useCase = new LoginUseCase(
      userRepository,
      passwordHasher,
      tokenService,
    );

    const result = await useCase.execute({
      email: "test@example.com",
      password: "StrongPass123",
    });

    expect(result.user).toEqual(mockUser);
    expect(result.accessToken).toBe("fake-access-token");

    expect(passwordHasher.verify).toHaveBeenCalledWith(
      "StrongPass123",
      "hashed-password",
    );

    expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
      userId: 1,
      email: "test@example.com",
    });
  });

  it("should reject when user does not exist", async () => {
    const userRepository = {
      findCredentialsByEmail: vi.fn().mockResolvedValue(null),
    } as unknown as UserRepository;

    const passwordHasher = {
      verify: vi.fn(),
    } as unknown as PasswordHasher;

    const tokenService = {
      generateAccessToken: vi.fn(),
    } as unknown as TokenService;

    const useCase = new LoginUseCase(
      userRepository,
      passwordHasher,
      tokenService,
    );

    await expect(
      useCase.execute({
        email: "unknown@example.com",
        password: "StrongPass123",
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(passwordHasher.verify).not.toHaveBeenCalled();
    expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
  });

  it("should reject when password is incorrect", async () => {
    const userRepository = {
      findCredentialsByEmail: vi.fn().mockResolvedValue({
        user: mockUser,
        passwordHash: "hashed-password",
      }),
    } as unknown as UserRepository;

    const passwordHasher = {
      verify: vi.fn().mockResolvedValue(false),
    } as unknown as PasswordHasher;

    const tokenService = {
      generateAccessToken: vi.fn(),
    } as unknown as TokenService;

    const useCase = new LoginUseCase(
      userRepository,
      passwordHasher,
      tokenService,
    );

    await expect(
      useCase.execute({
        email: "test@example.com",
        password: "WrongPassword",
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
  });
});
