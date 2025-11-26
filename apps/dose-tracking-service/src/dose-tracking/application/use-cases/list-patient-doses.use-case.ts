import { Injectable, Inject } from '@nestjs/common';
import { DoseTracking } from '../../domain/entities/dose-tracking.entity';
import { DoseTrackingRepositoryPort } from '../../domain/repositories/dose-tracking.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class ListPatientDosesUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.DOSE_TRACKING_REPOSITORY)
    private readonly doseTrackingRepository: DoseTrackingRepositoryPort,
  ) {}

  async execute(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DoseTracking[]> {
    return await this.doseTrackingRepository.findByPatientId(patientId, startDate, endDate);
  }
}

