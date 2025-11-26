export enum UserRole {
  PACIENTE = 'PACIENTE',
  CUIDADOR = 'CUIDADOR',
  ADMIN = 'ADMIN',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    nome: string,
    email: string,
    role: UserRole,
    createdAt?: Date,
    updatedAt?: Date,
  ): User {
    return new User(
      id,
      nome,
      email,
      role,
      createdAt || new Date(),
      updatedAt || new Date(),
    );
  }
}

