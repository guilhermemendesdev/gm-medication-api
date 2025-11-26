export class DoseScheduledReceivedEvent {
  constructor(
    public readonly doseScheduleId: string,
    public readonly prescriptionId: string,
    public readonly patientId: string,
    public readonly scheduledAt: Date,
  ) {}
}

