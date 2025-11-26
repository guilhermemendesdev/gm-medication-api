import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { DoseTracking, DoseTrackingStatus } from '../../domain/entities/dose-tracking.entity';
import { DoseTrackingRepositoryPort } from '../../domain/repositories/dose-tracking.repository.port';
import { EventPublisherPort } from '../../domain/ports/event-publisher.port';
import { ConfirmDoseDto } from '../dto/confirm-dose.dto';
import { DoseTakenEvent } from '../../domain/events/dose-taken.event';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';
import { INJECTION_TOKENS as EVENT_INJECTION_TOKENS } from '../../domain/ports/injection.tokens';

@Injectable()
export class ConfirmDoseUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.DOSE_TRACKING_REPOSITORY)
    private readonly doseTrackingRepository: DoseTrackingRepositoryPort,
    @Inject(EVENT_INJECTION_TOKENS.EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(doseId: string, dto: ConfirmDoseDto): Promise<DoseTracking> {
    const doseTracking = await this.doseTrackingRepository.findById(doseId);

    if (!doseTracking) {
      throw new NotFoundException(`Dose com ID ${doseId} não encontrada`);
    }

    if (doseTracking.status !== DoseTrackingStatus.PENDING) {
      throw new BadRequestException(
        `Dose já foi ${doseTracking.status === DoseTrackingStatus.TAKEN ? 'confirmada' : doseTracking.status === DoseTrackingStatus.LATE ? 'confirmada como atrasada' : 'marcada como perdida'}`,
      );
    }

    const takenAt = dto.takenAt ? new Date(dto.takenAt) : new Date();
    const updated = doseTracking.markAsTaken(takenAt);

    const saved = await this.doseTrackingRepository.update(doseId, {
      status: updated.status,
      takenAt: updated.takenAt,
      delayInMinutes: updated.delayInMinutes,
    });

    // Publicar evento de dose tomada
    const event = new DoseTakenEvent(
      saved.id,
      saved.doseScheduleId,
      saved.patientId,
      saved.scheduledAt,
      saved.takenAt!,
      saved.delayInMinutes || 0,
      saved.status === DoseTrackingStatus.LATE,
    );

    await this.eventPublisher.publishDoseTaken(event);

    return saved;
  }
}

