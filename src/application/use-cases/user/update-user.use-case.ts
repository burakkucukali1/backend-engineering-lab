import type {
  UserRepository,
  UpdateUserData,
} from "../../../domain/repositories/user.repository.js";

import type { User } from "../../../domain/entities/user.entity.js";

import { UserNotFoundError } from "../../errors/user-not-found.error.js";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, data: UpdateUserData): Promise<User> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new UserNotFoundError(id);
    }

    return this.userRepository.update(id, data);
  }
}
