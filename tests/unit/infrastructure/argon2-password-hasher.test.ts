import { describe, it, expect } from "vitest";

import { Argon2PasswordHasher } from "../../../src/infrastructure/security/argon2-password-hasher.js";

describe("Argon2PasswordHasher", () => {
  const passwordHasher = new Argon2PasswordHasher();

  it("should hash a password", async () => {
    const password = "MyPassword123!";

    const hashedPassword = await passwordHasher.hash(password);

    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword).toContain("$argon2id$");
  });

  it("should verify a correct password", async () => {
    const password = "MyPassword123!";

    const hashedPassword = await passwordHasher.hash(password);

    const isValid = await passwordHasher.verify(password, hashedPassword);

    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "MyPassword123!";
    const wrongPassword = "WrongPassword123!";

    const hashedPassword = await passwordHasher.hash(password);

    const isValid = await passwordHasher.verify(wrongPassword, hashedPassword);

    expect(isValid).toBe(false);
  });
});
