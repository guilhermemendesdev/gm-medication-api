export class PrescriptionCreatedEvent {
  constructor(
    public readonly prescriptionId: string,
    public readonly patientId: string,
    public readonly medicationId: string,
    public readonly dose: number,
    public readonly unit: string,
    public readonly frequency: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly intervalHours?: number,
    public readonly customSchedule?: string[],
  ) {}
}

