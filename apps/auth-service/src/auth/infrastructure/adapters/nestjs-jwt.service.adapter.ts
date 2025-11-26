import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@gm-medication-api/core';
import { JwtServicePort } from '../../domain/ports/jwt.service.port';

@Injectable()
export class NestJwtServiceAdapter implements JwtServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(userId: string, email: string, role: UserRole): string {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '24h',
    });
  }

  verifyToken(token: string): { userId: string; email: string; role: UserRole } | null {
    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production';
      const payload = this.jwtService.verify(token, { secret });

      return {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }
}

