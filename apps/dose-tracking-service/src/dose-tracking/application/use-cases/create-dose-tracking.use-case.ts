import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DoseTracking, DoseTrackingStatus } from '../../domain/entities/dose-tracking.entity';
import { DoseTrackingRepositoryPort } from '../../domain/repositories/dose-tracking.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

export interface CreateDoseTrackingData {
  doseScheduleId: string;
  scheduledAt: Date;
  patientId: string;
  caregiverId?: string;
}

@Injectable()
export class CreateDoseTrackingUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.DOSE_TRACKING_REPOSITORY)
    private readonly doseTrackingRepository: DoseTrackingRepositoryPort,
  ) {}

  async execute(data: CreateDoseTrackingData): Promise<DoseTracking> {
    // Verificar se já existe tracking para este schedule
    const existing = await this.doseTrackingRepository.findByDoseScheduleId(data.doseScheduleId);

    if (existing) {
      return existing;
    }

    const doseTracking = DoseTracking.create({
      id: uuidv4(),
      doseScheduleId: data.doseScheduleId,
      scheduledAt: data.scheduledAt,
      patientId: data.patientId,
      caregiverId: data.caregiverId,
      status: DoseTrackingStatus.PENDING,
    });

    return await this.doseTrackingRepository.create(doseTracking);
  }
}

