import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordServicePort } from '../../domain/ports/password.service.port';

@Injectable()
export class BcryptPasswordServiceAdapter implements PasswordServicePort {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

