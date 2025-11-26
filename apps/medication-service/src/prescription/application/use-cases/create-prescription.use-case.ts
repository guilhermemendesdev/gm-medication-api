import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Prescription } from '../../domain/entities/prescription.entity';
import { PrescriptionRepositoryPort } from '../../domain/repositories/prescription.repository.port';
import { EventPublisherPort } from '../../domain/ports/event-publisher.port';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
import { PrescriptionCreatedEvent } from '../../domain/events/prescription-created.event';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';
import { INJECTION_TOKENS as EVENT_INJECTION_TOKENS } from '../../domain/ports/injection.tokens';

@Injectable()
export class CreatePrescriptionUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.PRESCRIPTION_REPOSITORY)
    private readonly prescriptionRepository: PrescriptionRepositoryPort,
    @Inject(EVENT_INJECTION_TOKENS.EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(dto: CreatePrescriptionDto): Promise<Prescription> {
    const prescription = Prescription.create({
      id: uuidv4(),
      patientId: dto.patientId,
      medicationId: dto.medicationId,
      dose: dto.dose,
      unit: dto.unit,
      frequency: dto.frequency,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      intervalHours: dto.intervalHours,
      customSchedule: dto.customSchedule,
    });

    const created = await this.prescriptionRepository.create(prescription);

    // Publicar evento de prescrição criada
    const event = new PrescriptionCreatedEvent(
      created.id,
      created.patientId,
      created.medicationId,
      created.dose,
      created.unit,
      created.frequency,
      created.startDate,
      created.endDate,
      created.intervalHours,
      created.customSchedule,
    );

    await this.eventPublisher.publishPrescriptionCreated(event);

    return created;
  }
}

