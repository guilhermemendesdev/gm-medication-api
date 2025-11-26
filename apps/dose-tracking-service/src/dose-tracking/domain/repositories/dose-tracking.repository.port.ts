import { DoseTracking } from '../entities/dose-tracking.entity';

export interface DoseTrackingRepositoryPort {
  create(doseTracking: DoseTracking): Promise<DoseTracking>;
  findById(id: string): Promise<DoseTracking | null>;
  findByDoseScheduleId(doseScheduleId: string): Promise<DoseTracking | null>;
  findByPatientId(patientId: string, startDate?: Date, endDate?: Date): Promise<DoseTracking[]>;
  findPendingByScheduledDateBefore(date: Date): Promise<DoseTracking[]>;
  update(id: string, doseTracking: Partial<DoseTracking>): Promise<DoseTracking>;
}

