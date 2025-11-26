import { Injectable, Inject } from '@nestjs/common';
import { DoseSchedule } from '../../domain/entities/dose-schedule.entity';
import { DoseScheduleRepositoryPort } from '../../domain/repositories/dose-schedule.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class ListSchedulesUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.DOSE_SCHEDULE_REPOSITORY)
    private readonly doseScheduleRepository: DoseScheduleRepositoryPort,
  ) {}

  async execute(patientId?: string, prescriptionId?: string): Promise<DoseSchedule[]> {
    if (prescriptionId) {
      return await this.doseScheduleRepository.findByPrescriptionId(prescriptionId);
    }
    if (patientId) {
      return await this.doseScheduleRepository.findByPatientId(patientId);
    }
    return [];
  }
}

