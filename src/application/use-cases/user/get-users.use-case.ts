import type { UserRepository } from "../../../domain/repositories/user.repository.js";
import type { User } from "../../../domain/entities/user.entity.js";

export interface GetUsersInput {
  page: number;
  limit: number;
}

export interface GetUsersOutput {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetUsersInput): Promise<GetUsersOutput> {
    const { page, limit } = input;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepository.findAll(skip, limit),
      this.userRepository.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
