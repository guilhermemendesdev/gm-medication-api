import { User, UserRole } from '@gm-medication-api/core';

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findPasswordByEmail(email: string): Promise<string | null>;
  create(
    nome: string,
    email: string,
    senhaHash: string,
    role: UserRole,
  ): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
}

