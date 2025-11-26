import { Injectable } from '@nestjs/common';
import { DoseTracking } from '../../domain/entities/dose-tracking.entity';
import { DoseTrackingRepositoryPort } from '../../domain/repositories/dose-tracking.repository.port';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { DoseTrackingMapper } from '../mappers/dose-tracking.mapper';
import { DoseTrackingStatus } from '../../domain/entities/dose-tracking.entity';

@Injectable()
export class PrismaDoseTrackingRepositoryAdapter implements DoseTrackingRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(doseTracking: DoseTracking): Promise<DoseTracking> {
    const prismaData = DoseTrackingMapper.toPersistence(doseTracking);
    const created = await this.prisma.doseTracking.create({
      data: prismaData,
    });
    return DoseTrackingMapper.toDomain(created);
  }

  async findById(id: string): Promise<DoseTracking | null> {
    const tracking = await this.prisma.doseTracking.findUnique({
      where: { id },
    });
    return tracking ? DoseTrackingMapper.toDomain(tracking) : null;
  }

  async findByDoseScheduleId(doseScheduleId: string): Promise<DoseTracking | null> {
    const tracking = await this.prisma.doseTracking.findFirst({
      where: { doseScheduleId },
    });
    return tracking ? DoseTrackingMapper.toDomain(tracking) : null;
  }

  async findByPatientId(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DoseTracking[]> {
    const where: any = { patientId };
    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) {
        where.scheduledAt.gte = startDate;
      }
      if (endDate) {
        where.scheduledAt.lte = endDate;
      }
    }

    const trackings = await this.prisma.doseTracking.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
    });
    return trackings.map(DoseTrackingMapper.toDomain);
  }

  async findPendingByScheduledDateBefore(date: Date): Promise<DoseTracking[]> {
    const trackings = await this.prisma.doseTracking.findMany({
      where: {
        status: DoseTrackingStatus.PENDING,
        scheduledAt: {
          lte: date,
        },
      },
    });
    return trackings.map(DoseTrackingMapper.toDomain);
  }

  async update(id: string, doseTracking: Partial<DoseTracking>): Promise<DoseTracking> {
    const updateData: any = {};
    if (doseTracking.status !== undefined) updateData.status = doseTracking.status;
    if (doseTracking.takenAt !== undefined) updateData.takenAt = doseTracking.takenAt;
    if (doseTracking.delayInMinutes !== undefined)
      updateData.delayInMinutes = doseTracking.delayInMinutes;

    const updated = await this.prisma.doseTracking.update({
      where: { id },
      data: updateData,
    });
    return DoseTrackingMapper.toDomain(updated);
  }
}

