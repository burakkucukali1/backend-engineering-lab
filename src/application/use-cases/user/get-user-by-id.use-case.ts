import type { UserRepository } from "../../../domain/repositories/user.repository.js";
import { UserNotFoundError } from "../../errors/user-not-found.error.js";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }
}
