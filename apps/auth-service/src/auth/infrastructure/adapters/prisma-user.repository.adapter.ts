import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { User, UserRole } from '@gm-medication-api/core';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';

@Injectable()
export class PrismaUserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userData) {
      return null;
    }

    return User.create(
      userData.id,
      userData.nome,
      userData.email,
      userData.role as UserRole,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    return User.create(
      userData.id,
      userData.nome,
      userData.email,
      userData.role as UserRole,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async create(
    nome: string,
    email: string,
    senhaHash: string,
    role: UserRole,
  ): Promise<User> {
    const userData = await this.prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role,
      },
    });

    return User.create(
      userData.id,
      userData.nome,
      userData.email,
      userData.role as UserRole,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async findPasswordByEmail(email: string): Promise<string | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
      select: { senha: true },
    });

    return userData?.senha || null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });

    return count > 0;
  }
}

