import type { User } from "../../domain/entities/user.entity.js";
import type { UserRole } from "../../domain/enums/user-role.js";

export interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
  };
}
