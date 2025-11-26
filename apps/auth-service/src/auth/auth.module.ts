import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './domain/services/auth.service';
import { PrismaUserRepositoryAdapter } from './infrastructure/adapters/prisma-user.repository.adapter';
import { BcryptPasswordServiceAdapter } from './infrastructure/adapters/bcrypt-password.service.adapter';
import { NestJwtServiceAdapter } from './infrastructure/adapters/nestjs-jwt.service.adapter';
import {
  USER_REPOSITORY_PORT,
  PASSWORD_SERVICE_PORT,
  JWT_SERVICE_PORT,
} from './domain/ports/injection.tokens';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { JwtStrategy } from '@gm-medication-api/shared';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepositoryAdapter,
    },
    {
      provide: PASSWORD_SERVICE_PORT,
      useClass: BcryptPasswordServiceAdapter,
    },
    {
      provide: JWT_SERVICE_PORT,
      useClass: NestJwtServiceAdapter,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}

