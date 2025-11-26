export enum DoseTrackingStatus {
  PENDING = 'PENDING',
  TAKEN = 'TAKEN',
  MISSED = 'MISSED',
  LATE = 'LATE',
}

export class DoseTracking {
  constructor(
    public readonly id: string,
    public readonly doseScheduleId: string,
    public readonly status: DoseTrackingStatus,
    public readonly scheduledAt: Date,
    public readonly takenAt: Date | null,
    public readonly delayInMinutes: number | null,
    public readonly patientId: string,
    public readonly caregiverId: string | null,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(props: {
    id: string;
    doseScheduleId: string;
    status?: DoseTrackingStatus;
    scheduledAt: Date;
    takenAt?: Date | null;
    delayInMinutes?: number | null;
    patientId: string;
    caregiverId?: string | null;
    createdAt?: Date;
  }): DoseTracking {
    return new DoseTracking(
      props.id,
      props.doseScheduleId,
      props.status || DoseTrackingStatus.PENDING,
      props.scheduledAt,
      props.takenAt || null,
      props.delayInMinutes || null,
      props.patientId,
      props.caregiverId || null,
      props.createdAt || new Date(),
    );
  }

  markAsTaken(takenAt: Date): DoseTracking {
    const delayInMinutes = Math.max(
      0,
      Math.floor((takenAt.getTime() - this.scheduledAt.getTime()) / (1000 * 60)),
    );

    const status =
      delayInMinutes > 15 ? DoseTrackingStatus.LATE : DoseTrackingStatus.TAKEN;

    return DoseTracking.create({
      id: this.id,
      doseScheduleId: this.doseScheduleId,
      status,
      scheduledAt: this.scheduledAt,
      takenAt,
      delayInMinutes,
      patientId: this.patientId,
      caregiverId: this.caregiverId,
      createdAt: this.createdAt,
    });
  }

  markAsMissed(): DoseTracking {
    return DoseTracking.create({
      id: this.id,
      doseScheduleId: this.doseScheduleId,
      status: DoseTrackingStatus.MISSED,
      scheduledAt: this.scheduledAt,
      takenAt: null,
      delayInMinutes: null,
      patientId: this.patientId,
      caregiverId: this.caregiverId,
      createdAt: this.createdAt,
    });
  }
}

