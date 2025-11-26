import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { User, UserRole } from '@gm-medication-api/core';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { PasswordServicePort } from '../ports/password.service.port';
import { JwtServicePort } from '../ports/jwt.service.port';
import {
  USER_REPOSITORY_PORT,
  PASSWORD_SERVICE_PORT,
  JWT_SERVICE_PORT,
} from '../ports/injection.tokens';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_SERVICE_PORT)
    private readonly passwordService: PasswordServicePort,
    @Inject(JWT_SERVICE_PORT)
    private readonly jwtService: JwtServicePort,
  ) {}

  async login(email: string, senha: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaHash = await this.userRepository.findPasswordByEmail(email);

    if (!senhaHash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isValidPassword = await this.passwordService.compare(senha, senhaHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  async register(
    nome: string,
    email: string,
    senha: string,
    role: UserRole,
  ): Promise<{ user: User; token: string }> {
    const emailExists = await this.userRepository.existsByEmail(email);

    if (emailExists) {
      throw new ConflictException('Email já está em uso');
    }

    const senhaHash = await this.passwordService.hash(senha);
    const user = await this.userRepository.create(nome, email, senhaHash, role);

    const token = this.jwtService.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}

