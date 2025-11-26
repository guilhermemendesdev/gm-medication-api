import { Injectable, Inject } from '@nestjs/common';
import { Prescription } from '../../domain/entities/prescription.entity';
import { PrescriptionRepositoryPort } from '../../domain/repositories/prescription.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class ListPrescriptionsUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.PRESCRIPTION_REPOSITORY)
    private readonly prescriptionRepository: PrescriptionRepositoryPort,
  ) {}

  async execute(patientId?: string): Promise<Prescription[]> {
    if (patientId) {
      return await this.prescriptionRepository.findByPatientId(patientId);
    }
    return await this.prescriptionRepository.findAll();
  }
}

