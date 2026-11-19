import type {
  CreateUserData,
  UserRepository,
} from "../../../domain/repositories/user.repository.js";

import { UserAlreadyExistsError } from "../../errors/user-already-exists.error.js";

import type { User } from "../../../domain/entities/user.entity.js";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: CreateUserData): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      data.email,
    );

    if (existingUser) {
      throw new UserAlreadyExistsError(data.email);
    }

    const user = await this.userRepository.create(data);

    return user;
  }
}