import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MedicationRepositoryPort } from '../../domain/repositories/medication.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class DeleteMedicationUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.MEDICATION_REPOSITORY)
    private readonly medicationRepository: MedicationRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.medicationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Medicamento com ID ${id} não encontrado`);
    }

    await this.medicationRepository.delete(id);
  }
}

