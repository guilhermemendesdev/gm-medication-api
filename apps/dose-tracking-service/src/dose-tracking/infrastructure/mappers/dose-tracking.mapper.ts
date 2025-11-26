import { DoseTracking, DoseTrackingStatus } from '../../domain/entities/dose-tracking.entity';
import { DoseTracking as PrismaDoseTracking } from '@prisma/client';

export class DoseTrackingMapper {
  static toDomain(prismaTracking: PrismaDoseTracking): DoseTracking {
    return DoseTracking.create({
      id: prismaTracking.id,
      doseScheduleId: prismaTracking.doseScheduleId,
      status: prismaTracking.status as DoseTrackingStatus,
      scheduledAt: prismaTracking.scheduledAt,
      takenAt: prismaTracking.takenAt || null,
      delayInMinutes: prismaTracking.delayInMinutes || null,
      patientId: prismaTracking.patientId,
      caregiverId: prismaTracking.caregiverId || null,
      createdAt: prismaTracking.createdAt,
    });
  }

  static toPersistence(
    tracking: DoseTracking,
  ): Omit<PrismaDoseTracking, 'createdAt' | 'updatedAt'> {
    return {
      id: tracking.id,
      doseScheduleId: tracking.doseScheduleId,
      status: tracking.status as any,
      scheduledAt: tracking.scheduledAt,
      takenAt: tracking.takenAt,
      delayInMinutes: tracking.delayInMinutes,
      patientId: tracking.patientId,
      caregiverId: tracking.caregiverId,
    };
  }
}

