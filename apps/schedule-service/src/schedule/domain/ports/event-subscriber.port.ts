export interface EventSubscriberPort {
  subscribeToPrescriptionCreated(): Promise<void>;
}

