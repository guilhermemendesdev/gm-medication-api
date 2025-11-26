import { Injectable } from '@nestjs/common';
import { Prescription } from '../../domain/entities/prescription.entity';
import { PrescriptionRepositoryPort } from '../../domain/repositories/prescription.repository.port';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { PrescriptionMapper } from '../mappers/prescription.mapper';

@Injectable()
export class PrismaPrescriptionRepositoryAdapter implements PrescriptionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(prescription: Prescription): Promise<Prescription> {
    const prismaData = PrescriptionMapper.toPersistence(prescription);
    const created = await this.prisma.prescription.create({
      data: prismaData,
    });
    return PrescriptionMapper.toDomain(created);
  }

  async findById(id: string): Promise<Prescription | null> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });
    return prescription ? PrescriptionMapper.toDomain(prescription) : null;
  }

  async findByPatientId(patientId: string): Promise<Prescription[]> {
    const prescriptions = await this.prisma.prescription.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
    return prescriptions.map(PrescriptionMapper.toDomain);
  }

  async findAll(): Promise<Prescription[]> {
    const prescriptions = await this.prisma.prescription.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return prescriptions.map(PrescriptionMapper.toDomain);
  }

  async update(id: string, prescription: Partial<Prescription>): Promise<Prescription> {
    const updateData: any = {};
    if (prescription.patientId !== undefined) updateData.patientId = prescription.patientId;
    if (prescription.medicationId !== undefined) updateData.medicationId = prescription.medicationId;
    if (prescription.dose !== undefined) updateData.dose = prescription.dose;
    if (prescription.unit !== undefined) updateData.unit = prescription.unit;
    if (prescription.frequency !== undefined) updateData.frequency = prescription.frequency;
    if (prescription.startDate !== undefined) updateData.startDate = prescription.startDate;
    if (prescription.endDate !== undefined) updateData.endDate = prescription.endDate;
    if (prescription.intervalHours !== undefined) updateData.intervalHours = prescription.intervalHours;
    if (prescription.customSchedule !== undefined) {
      updateData.customSchedule = prescription.customSchedule
        ? JSON.stringify(prescription.customSchedule)
        : null;
    }

    const updated = await this.prisma.prescription.update({
      where: { id },
      data: updateData,
    });
    return PrescriptionMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prescription.delete({
      where: { id },
    });
  }
}

