import type { UserRepository } from "../../../domain/repositories/user.repository.js";
import type { PasswordHasher } from "../../ports/password-hasher.js";
import type { User } from "../../../domain/entities/user.entity.js";

import { UserAlreadyExistsError } from "../../errors/user-already-exists.error.js";

export interface RegisterInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(data: RegisterInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(data.email);
    }

    const passwordHash = await this.passwordHasher.hash(data.password);

    return this.userRepository.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash,
    });
  }
}
