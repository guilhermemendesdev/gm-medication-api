import { DoseSchedule, DoseScheduleStatus } from '../../domain/entities/dose-schedule.entity';
import { DoseSchedule as PrismaDoseSchedule } from '@prisma/client';

export class DoseScheduleMapper {
  static toDomain(prismaSchedule: PrismaDoseSchedule): DoseSchedule {
    return DoseSchedule.create({
      id: prismaSchedule.id,
      prescriptionId: prismaSchedule.prescriptionId,
      patientId: prismaSchedule.patientId,
      scheduledAt: prismaSchedule.scheduledAt,
      status: prismaSchedule.status as DoseScheduleStatus,
      createdAt: prismaSchedule.createdAt,
    });
  }

  static toPersistence(
    schedule: DoseSchedule,
  ): Omit<PrismaDoseSchedule, 'createdAt' | 'updatedAt'> {
    return {
      id: schedule.id,
      prescriptionId: schedule.prescriptionId,
      patientId: schedule.patientId,
      scheduledAt: schedule.scheduledAt,
      status: schedule.status as any,
    };
  }
}

