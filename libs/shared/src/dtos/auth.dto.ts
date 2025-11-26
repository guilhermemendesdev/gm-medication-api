import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@gm-medication-api/core';

export class LoginDto {
  @ApiProperty({ example: 'usuario@example.com', description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário', minLength: 6 })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome!: string;

  @ApiProperty({ example: 'usuario@example.com', description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email!: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário', minLength: 6 })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha!: string;

  @ApiProperty({
    example: 'PACIENTE',
    description: 'Role do usuário',
    enum: UserRole,
    default: UserRole.PACIENTE,
  })
  @IsEnum(UserRole, { message: 'Role deve ser PACIENTE, CUIDADOR ou ADMIN' })
  @IsNotEmpty({ message: 'Role é obrigatória' })
  role!: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT Token' })
  accessToken!: string;

  @ApiProperty({ example: 'user-id-123', description: 'ID do usuário' })
  userId!: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  nome!: string;

  @ApiProperty({ example: 'usuario@example.com', description: 'Email do usuário' })
  email!: string;

  @ApiProperty({ example: 'PACIENTE', description: 'Role do usuário', enum: UserRole })
  role!: UserRole;
}

