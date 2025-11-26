import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@gm-medication-api/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const canActivateResult = super.canActivate(context);
    
    // Converter para Promise se necessário
    let result: boolean;
    if (typeof canActivateResult === 'boolean') {
      result = canActivateResult;
    } else if (canActivateResult instanceof Promise) {
      result = await canActivateResult;
    } else {
      // Observable
      result = await firstValueFrom(canActivateResult);
    }

    if (!result) {
      return false;
    }

    // Se não há roles requeridas, retorna o resultado da autenticação
    if (!requiredRoles) {
      return result;
    }

    // Verifica se o usuário tem a role necessária
    return this.hasRequiredRole(context, requiredRoles);
  }

  private hasRequiredRole(context: ExecutionContext, requiredRoles: UserRole[]): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}

