import { Prescription, FrequencyType } from '../../domain/entities/prescription.entity';
import { Prescription as PrismaPrescription } from '@prisma/client';

export class PrescriptionMapper {
  static toDomain(prismaPrescription: PrismaPrescription): Prescription {
    let customSchedule: string[] | undefined;
    if (prismaPrescription.customSchedule) {
      try {
        customSchedule = JSON.parse(prismaPrescription.customSchedule);
      } catch {
        customSchedule = undefined;
      }
    }

    return Prescription.create({
      id: prismaPrescription.id,
      patientId: prismaPrescription.patientId,
      medicationId: prismaPrescription.medicationId,
      dose: prismaPrescription.dose,
      unit: prismaPrescription.unit,
      frequency: prismaPrescription.frequency as FrequencyType,
      startDate: prismaPrescription.startDate,
      endDate: prismaPrescription.endDate,
      intervalHours: prismaPrescription.intervalHours || undefined,
      customSchedule,
    });
  }

  static toPersistence(
    prescription: Prescription,
  ): Omit<PrismaPrescription, 'createdAt' | 'updatedAt'> {
    return {
      id: prescription.id,
      patientId: prescription.patientId,
      medicationId: prescription.medicationId,
      dose: prescription.dose,
      unit: prescription.unit,
      frequency: prescription.frequency,
      startDate: prescription.startDate,
      endDate: prescription.endDate,
      intervalHours: prescription.intervalHours || null,
      customSchedule: prescription.customSchedule
        ? JSON.stringify(prescription.customSchedule)
        : null,
    };
  }
}

