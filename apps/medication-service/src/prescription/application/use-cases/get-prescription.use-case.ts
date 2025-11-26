import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Prescription } from '../../domain/entities/prescription.entity';
import { PrescriptionRepositoryPort } from '../../domain/repositories/prescription.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class GetPrescriptionUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.PRESCRIPTION_REPOSITORY)
    private readonly prescriptionRepository: PrescriptionRepositoryPort,
  ) {}

  async execute(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findById(id);
    if (!prescription) {
      throw new NotFoundException(`Prescrição com ID ${id} não encontrada`);
    }
    return prescription;
  }
}

