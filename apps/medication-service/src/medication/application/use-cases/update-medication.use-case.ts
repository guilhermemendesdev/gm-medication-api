import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Medication } from '../../domain/entities/medication.entity';
import { MedicationRepositoryPort } from '../../domain/repositories/medication.repository.port';
import { UpdateMedicationDto } from '../dto/update-medication.dto';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class UpdateMedicationUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.MEDICATION_REPOSITORY)
    private readonly medicationRepository: MedicationRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateMedicationDto): Promise<Medication> {
    const existing = await this.medicationRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Medicamento com ID ${id} não encontrado`);
    }

    return await this.medicationRepository.update(id, dto);
  }
}

