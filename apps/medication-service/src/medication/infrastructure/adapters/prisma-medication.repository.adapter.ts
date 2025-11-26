import { Injectable } from '@nestjs/common';
import { Medication } from '../../domain/entities/medication.entity';
import { MedicationRepositoryPort } from '../../domain/repositories/medication.repository.port';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { MedicationMapper } from '../mappers/medication.mapper';

@Injectable()
export class PrismaMedicationRepositoryAdapter implements MedicationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(medication: Medication): Promise<Medication> {
    const prismaData = MedicationMapper.toPersistence(medication);
    const created = await this.prisma.medication.create({
      data: prismaData,
    });
    return MedicationMapper.toDomain(created);
  }

  async findById(id: string): Promise<Medication | null> {
    const medication = await this.prisma.medication.findUnique({
      where: { id },
    });
    return medication ? MedicationMapper.toDomain(medication) : null;
  }

  async findAll(): Promise<Medication[]> {
    const medications = await this.prisma.medication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return medications.map(MedicationMapper.toDomain);
  }

  async update(id: string, medication: Partial<Medication>): Promise<Medication> {
    const updateData: any = {};
    if (medication.name !== undefined) updateData.name = medication.name;
    if (medication.description !== undefined) updateData.description = medication.description;
    if (medication.type !== undefined) updateData.type = medication.type;
    if (medication.imageUrl !== undefined) updateData.imageUrl = medication.imageUrl;

    const updated = await this.prisma.medication.update({
      where: { id },
      data: updateData,
    });
    return MedicationMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.medication.delete({
      where: { id },
    });
  }
}

