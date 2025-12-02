import { Injectable, Inject } from '@nestjs/common';
import { TimelineEvent, TimelineEventType } from '../../domain/entities/timeline-event.entity';
import { ReportRepositoryPort } from '../../domain/repositories/report.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class GetTimelineEventsUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepositoryPort,
  ) {}

  async execute(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TimelineEvent[]> {
    const eventsData = await this.reportRepository.getTimelineEvents(
      patientId,
      startDate,
      endDate,
    );

    return eventsData.map((data) =>
      TimelineEvent.create({
        id: data.id,
        type: data.type as TimelineEventType,
        scheduledAt: new Date(data.scheduledAt),
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : null,
        delayInMinutes: data.delayInMinutes,
        medicationName: data.medicationName,
        dose: data.dose,
      }),
    );
  }
}

