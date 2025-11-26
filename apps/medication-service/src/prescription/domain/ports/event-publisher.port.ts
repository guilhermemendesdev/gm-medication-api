import { PrescriptionCreatedEvent } from '../events/prescription-created.event';

export interface EventPublisherPort {
  publishPrescriptionCreated(event: PrescriptionCreatedEvent): Promise<void>;
}

