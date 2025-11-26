import { DoseSchedule } from '../entities/dose-schedule.entity';

export interface DoseScheduleRepositoryPort {
  create(doseSchedule: DoseSchedule): Promise<DoseSchedule>;
  createMany(doseSchedules: DoseSchedule[]): Promise<DoseSchedule[]>;
  findById(id: string): Promise<DoseSchedule | null>;
  findByPrescriptionId(prescriptionId: string): Promise<DoseSchedule[]>;
  findByPatientId(patientId: string): Promise<DoseSchedule[]>;
  update(id: string, doseSchedule: Partial<DoseSchedule>): Promise<DoseSchedule>;
}

