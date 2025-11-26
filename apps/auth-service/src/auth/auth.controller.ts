import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './domain/services/auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from '@gm-medication-api/shared';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const { user, token } = await this.authService.login(loginDto.email, loginDto.senha);

    return {
      accessToken: token,
      userId: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { user, token } = await this.authService.register(
      registerDto.nome,
      registerDto.email,
      registerDto.senha,
      registerDto.role,
    );

    return {
      accessToken: token,
      userId: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    };
  }
}

