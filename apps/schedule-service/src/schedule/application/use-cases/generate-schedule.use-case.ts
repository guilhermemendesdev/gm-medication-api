import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DoseSchedule, DoseScheduleStatus } from '../../domain/entities/dose-schedule.entity';
import { DoseScheduleRepositoryPort } from '../../domain/repositories/dose-schedule.repository.port';
import { EventPublisherPort } from '../../domain/ports/event-publisher.port';
import { DoseScheduledEvent } from '../../domain/events/dose-scheduled.event';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';
import { INJECTION_TOKENS as EVENT_INJECTION_TOKENS } from '../../domain/ports/injection.tokens';

export interface PrescriptionData {
  prescriptionId: string;
  patientId: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  intervalHours?: number;
  customSchedule?: string[];
}

@Injectable()
export class GenerateScheduleUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.DOSE_SCHEDULE_REPOSITORY)
    private readonly doseScheduleRepository: DoseScheduleRepositoryPort,
    @Inject(EVENT_INJECTION_TOKENS.EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(prescriptionData: PrescriptionData): Promise<DoseSchedule[]> {
    const schedules = this.generateSchedules(prescriptionData);
    const created = await this.doseScheduleRepository.createMany(schedules);

    // Publicar eventos para cada dose agendada
    for (const schedule of created) {
      const event = new DoseScheduledEvent(
        schedule.id,
        schedule.prescriptionId,
        schedule.patientId,
        schedule.scheduledAt,
      );
      await this.eventPublisher.publishDoseScheduled(event);
    }

    return created;
  }

  private generateSchedules(prescriptionData: PrescriptionData): DoseSchedule[] {
    const schedules: DoseSchedule[] = [];
    const { startDate, endDate, frequency, intervalHours, customSchedule } = prescriptionData;

    let currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    if (frequency === 'DAILY') {
      // Uma vez por dia
      while (currentDate <= endDateTime) {
        schedules.push(
          DoseSchedule.create({
            id: uuidv4(),
            prescriptionId: prescriptionData.prescriptionId,
            patientId: prescriptionData.patientId,
            scheduledAt: new Date(currentDate),
            status: DoseScheduleStatus.PENDING,
          }),
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (frequency === 'INTERVAL_HOURS' && intervalHours) {
      // A cada X horas
      while (currentDate <= endDateTime) {
        schedules.push(
          DoseSchedule.create({
            id: uuidv4(),
            prescriptionId: prescriptionData.prescriptionId,
            patientId: prescriptionData.patientId,
            scheduledAt: new Date(currentDate),
            status: DoseScheduleStatus.PENDING,
          }),
        );
        currentDate.setHours(currentDate.getHours() + intervalHours);
      }
    } else if (frequency === 'CUSTOM' && customSchedule && customSchedule.length > 0) {
      // Horários customizados
      while (currentDate <= endDateTime) {
        for (const time of customSchedule) {
          const [hours, minutes] = time.split(':').map(Number);
          const scheduleDate = new Date(currentDate);
          scheduleDate.setHours(hours, minutes, 0, 0);

          if (scheduleDate <= endDateTime) {
            schedules.push(
              DoseSchedule.create({
                id: uuidv4(),
                prescriptionId: prescriptionData.prescriptionId,
                patientId: prescriptionData.patientId,
                scheduledAt: scheduleDate,
                status: DoseScheduleStatus.PENDING,
              }),
            );
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return schedules.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  }
}

