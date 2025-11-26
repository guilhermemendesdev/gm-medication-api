import { UserRole } from '@gm-medication-api/core';

export interface JwtServicePort {
  generateToken(userId: string, email: string, role: UserRole): string;
  verifyToken(token: string): { userId: string; email: string; role: UserRole } | null;
}

