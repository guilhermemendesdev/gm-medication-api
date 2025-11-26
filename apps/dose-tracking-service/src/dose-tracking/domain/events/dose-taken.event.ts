export class DoseTakenEvent {
  constructor(
    public readonly doseTrackingId: string,
    public readonly doseScheduleId: string,
    public readonly patientId: string,
    public readonly scheduledAt: Date,
    public readonly takenAt: Date,
    public readonly delayInMinutes: number,
    public readonly isLate: boolean,
  ) {}
}

