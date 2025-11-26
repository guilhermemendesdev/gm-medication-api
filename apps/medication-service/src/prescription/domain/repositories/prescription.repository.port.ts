import { Prescription } from '../entities/prescription.entity';

export interface PrescriptionRepositoryPort {
  create(prescription: Prescription): Promise<Prescription>;
  findById(id: string): Promise<Prescription | null>;
  findByPatientId(patientId: string): Promise<Prescription[]>;
  findAll(): Promise<Prescription[]>;
  update(id: string, prescription: Partial<Prescription>): Promise<Prescription>;
  delete(id: string): Promise<void>;
}

