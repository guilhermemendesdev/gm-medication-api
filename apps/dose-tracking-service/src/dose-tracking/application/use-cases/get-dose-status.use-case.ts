import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DoseTracking } from '../../domain/entities/dose-tracking.entity';
import { DoseTrackingRepositoryPort } from '../../domain/repositories/dose-tracking.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class GetDoseStatusUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.DOSE_TRACKING_REPOSITORY)
    private readonly doseTrackingRepository: DoseTrackingRepositoryPort,
  ) {}

  async execute(doseId: string): Promise<DoseTracking> {
    const doseTracking = await this.doseTrackingRepository.findById(doseId);

    if (!doseTracking) {
      throw new NotFoundException(`Dose com ID ${doseId} não encontrada`);
    }

    return doseTracking;
  }
}

