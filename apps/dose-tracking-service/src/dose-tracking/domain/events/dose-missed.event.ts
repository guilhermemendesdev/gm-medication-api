export class DoseMissedEvent {
  constructor(
    public readonly doseTrackingId: string,
    public readonly doseScheduleId: string,
    public readonly patientId: string,
    public readonly scheduledAt: Date,
    public readonly caregiverId?: string,
  ) {}
}

