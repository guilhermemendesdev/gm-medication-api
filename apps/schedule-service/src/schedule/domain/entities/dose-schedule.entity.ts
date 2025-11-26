export enum DoseScheduleStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
  MISSED = 'MISSED',
}

export class DoseSchedule {
  constructor(
    public readonly id: string,
    public readonly prescriptionId: string,
    public readonly patientId: string,
    public readonly scheduledAt: Date,
    public readonly status: DoseScheduleStatus,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(props: {
    id: string;
    prescriptionId: string;
    patientId: string;
    scheduledAt: Date;
    status?: DoseScheduleStatus;
    createdAt?: Date;
  }): DoseSchedule {
    return new DoseSchedule(
      props.id,
      props.prescriptionId,
      props.patientId,
      props.scheduledAt,
      props.status || DoseScheduleStatus.PENDING,
      props.createdAt || new Date(),
    );
  }

  markAsCompleted(): DoseSchedule {
    return DoseSchedule.create({
      id: this.id,
      prescriptionId: this.prescriptionId,
      patientId: this.patientId,
      scheduledAt: this.scheduledAt,
      status: DoseScheduleStatus.COMPLETED,
      createdAt: this.createdAt,
    });
  }

  markAsDelayed(): DoseSchedule {
    return DoseSchedule.create({
      id: this.id,
      prescriptionId: this.prescriptionId,
      patientId: this.patientId,
      scheduledAt: this.scheduledAt,
      status: DoseScheduleStatus.DELAYED,
      createdAt: this.createdAt,
    });
  }

  markAsMissed(): DoseSchedule {
    return DoseSchedule.create({
      id: this.id,
      prescriptionId: this.prescriptionId,
      patientId: this.patientId,
      scheduledAt: this.scheduledAt,
      status: DoseScheduleStatus.MISSED,
      createdAt: this.createdAt,
    });
  }
}
