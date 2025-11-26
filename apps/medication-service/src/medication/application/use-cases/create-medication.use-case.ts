import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '../../domain/entities/medication.entity';
import { MedicationRepositoryPort } from '../../domain/repositories/medication.repository.port';
import { CreateMedicationDto } from '../dto/create-medication.dto';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class CreateMedicationUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.MEDICATION_REPOSITORY)
    private readonly medicationRepository: MedicationRepositoryPort,
  ) {}

  async execute(dto: CreateMedicationDto): Promise<Medication> {
    const medication = Medication.create({
      id: uuidv4(),
      name: dto.name,
      description: dto.description,
      type: dto.type,
      imageUrl: dto.imageUrl,
    });

    return await this.medicationRepository.create(medication);
  }
}

