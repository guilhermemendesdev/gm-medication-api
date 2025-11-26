import { Injectable, Inject } from '@nestjs/common';
import { Medication } from '../../domain/entities/medication.entity';
import { MedicationRepositoryPort } from '../../domain/repositories/medication.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class ListMedicationsUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.MEDICATION_REPOSITORY)
    private readonly medicationRepository: MedicationRepositoryPort,
  ) {}

  async execute(): Promise<Medication[]> {
    return await this.medicationRepository.findAll();
  }
}

