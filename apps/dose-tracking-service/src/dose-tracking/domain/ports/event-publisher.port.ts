import { DoseTakenEvent } from '../events/dose-taken.event';
import { DoseMissedEvent } from '../events/dose-missed.event';

export interface EventPublisherPort {
  publishDoseTaken(event: DoseTakenEvent): Promise<void>;
  publishDoseMissed(event: DoseMissedEvent): Promise<void>;
}

