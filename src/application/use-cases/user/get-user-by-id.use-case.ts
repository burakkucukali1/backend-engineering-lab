import type { UserRepository } from "../../../domain/repositories/user.repository.js";
import type { User } from "../../../domain/entities/user.entity.js";

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}