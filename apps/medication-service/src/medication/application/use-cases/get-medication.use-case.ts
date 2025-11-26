import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Medication } from '../../domain/entities/medication.entity';
import { MedicationRepositoryPort } from '../../domain/repositories/medication.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class GetMedicationUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.MEDICATION_REPOSITORY)
    private readonly medicationRepository: MedicationRepositoryPort,
  ) {}

  async execute(id: string): Promise<Medication> {
    const medication = await this.medicationRepository.findById(id);
    if (!medication) {
      throw new NotFoundException(`Medicamento com ID ${id} não encontrado`);
    }
    return medication;
  }
}

