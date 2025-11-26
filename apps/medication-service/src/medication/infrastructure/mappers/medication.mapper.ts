import { Medication } from '../../domain/entities/medication.entity';
import { Medication as PrismaMedication } from '@prisma/client';

export class MedicationMapper {
  static toDomain(prismaMedication: PrismaMedication): Medication {
    return Medication.create({
      id: prismaMedication.id,
      name: prismaMedication.name,
      description: prismaMedication.description,
      type: prismaMedication.type,
      imageUrl: prismaMedication.imageUrl || undefined,
      createdAt: prismaMedication.createdAt,
    });
  }

  static toPersistence(medication: Medication): Omit<PrismaMedication, 'createdAt' | 'updatedAt'> {
    return {
      id: medication.id,
      name: medication.name,
      description: medication.description,
      type: medication.type,
      imageUrl: medication.imageUrl || null,
    };
  }
}

