import { DoseScheduledEvent } from '../events/dose-scheduled.event';

export interface EventPublisherPort {
  publishDoseScheduled(event: DoseScheduledEvent): Promise<void>;
}

