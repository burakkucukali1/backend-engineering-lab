import type { UserRepository } from "../../../domain/repositories/user.repository.js";
import type { PasswordHasher } from "../../ports/password-hasher.js";
import type { User } from "../../../domain/entities/user.entity.js";
import type { TokenService } from "../../ports/token-service.js";
import { InvalidCredentialsError } from "../../errors/invalid-credentials.error.js";

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(data: LoginInput): Promise<{
    user: User;
    accessToken: string;
  }> {
    const credentials = await this.userRepository.findCredentialsByEmail(
      data.email,
    );

    if (!credentials) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.verify(
      data.password,
      credentials.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenService.generateAccessToken({
      userId: credentials.user.id,
      email: credentials.user.email,
    });

    return {
      user: credentials.user,
      accessToken,
    };
  }
}
