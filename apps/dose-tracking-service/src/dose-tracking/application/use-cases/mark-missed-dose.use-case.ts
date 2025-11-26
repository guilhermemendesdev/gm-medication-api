import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { DoseTracking, DoseTrackingStatus } from '../../domain/entities/dose-tracking.entity';
import { DoseTrackingRepositoryPort } from '../../domain/repositories/dose-tracking.repository.port';
import { EventPublisherPort } from '../../domain/ports/event-publisher.port';
import { DoseMissedEvent } from '../../domain/events/dose-missed.event';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';
import { INJECTION_TOKENS as EVENT_INJECTION_TOKENS } from '../../domain/ports/injection.tokens';

@Injectable()
export class MarkMissedDoseUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.DOSE_TRACKING_REPOSITORY)
    private readonly doseTrackingRepository: DoseTrackingRepositoryPort,
    @Inject(EVENT_INJECTION_TOKENS.EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(doseId: string): Promise<DoseTracking> {
    const doseTracking = await this.doseTrackingRepository.findById(doseId);

    if (!doseTracking) {
      throw new NotFoundException(`Dose com ID ${doseId} não encontrada`);
    }

    if (doseTracking.status !== DoseTrackingStatus.PENDING) {
      throw new BadRequestException(`Dose já foi processada com status: ${doseTracking.status}`);
    }

    const updated = doseTracking.markAsMissed();

    const saved = await this.doseTrackingRepository.update(doseId, {
      status: updated.status,
    });

    // Publicar evento de dose perdida
    const event = new DoseMissedEvent(
      saved.id,
      saved.doseScheduleId,
      saved.patientId,
      saved.scheduledAt,
      saved.caregiverId || undefined,
    );

    await this.eventPublisher.publishDoseMissed(event);

    return saved;
  }
}

