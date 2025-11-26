import { Injectable } from '@nestjs/common';
import { DoseSchedule } from '../../domain/entities/dose-schedule.entity';
import { DoseScheduleRepositoryPort } from '../../domain/repositories/dose-schedule.repository.port';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { DoseScheduleMapper } from '../mappers/dose-schedule.mapper';

@Injectable()
export class PrismaDoseScheduleRepositoryAdapter implements DoseScheduleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(doseSchedule: DoseSchedule): Promise<DoseSchedule> {
    const prismaData = DoseScheduleMapper.toPersistence(doseSchedule);
    const created = await this.prisma.doseSchedule.create({
      data: prismaData,
    });
    return DoseScheduleMapper.toDomain(created);
  }

  async createMany(doseSchedules: DoseSchedule[]): Promise<DoseSchedule[]> {
    const prismaData = doseSchedules.map((schedule) => DoseScheduleMapper.toPersistence(schedule));
    await this.prisma.doseSchedule.createMany({
      data: prismaData,
    });
    // Retornar os schedules criados (Prisma createMany não retorna os registros)
    // Buscar novamente baseado nos IDs
    const ids = doseSchedules.map((s) => s.id);
    const created = await this.prisma.doseSchedule.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
    return created.map(DoseScheduleMapper.toDomain);
  }

  async findById(id: string): Promise<DoseSchedule | null> {
    const schedule = await this.prisma.doseSchedule.findUnique({
      where: { id },
    });
    return schedule ? DoseScheduleMapper.toDomain(schedule) : null;
  }

  async findByPrescriptionId(prescriptionId: string): Promise<DoseSchedule[]> {
    const schedules = await this.prisma.doseSchedule.findMany({
      where: { prescriptionId },
      orderBy: { scheduledAt: 'asc' },
    });
    return schedules.map(DoseScheduleMapper.toDomain);
  }

  async findByPatientId(patientId: string): Promise<DoseSchedule[]> {
    const schedules = await this.prisma.doseSchedule.findMany({
      where: { patientId },
      orderBy: { scheduledAt: 'asc' },
    });
    return schedules.map(DoseScheduleMapper.toDomain);
  }

  async update(id: string, doseSchedule: Partial<DoseSchedule>): Promise<DoseSchedule> {
    const updateData: any = {};
    if (doseSchedule.status !== undefined) updateData.status = doseSchedule.status;

    const updated = await this.prisma.doseSchedule.update({
      where: { id },
      data: updateData,
    });
    return DoseScheduleMapper.toDomain(updated);
  }
}

