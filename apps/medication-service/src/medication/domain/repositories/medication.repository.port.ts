import { Medication } from '../entities/medication.entity';

export interface MedicationRepositoryPort {
  create(medication: Medication): Promise<Medication>;
  findById(id: string): Promise<Medication | null>;
  findAll(): Promise<Medication[]>;
  update(id: string, medication: Partial<Medication>): Promise<Medication>;
  delete(id: string): Promise<void>;
}

