import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrescriptionRepositoryPort } from '../../domain/repositories/prescription.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class DeletePrescriptionUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.PRESCRIPTION_REPOSITORY)
    private readonly prescriptionRepository: PrescriptionRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.prescriptionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Prescrição com ID ${id} não encontrada`);
    }

    await this.prescriptionRepository.delete(id);
  }
}

