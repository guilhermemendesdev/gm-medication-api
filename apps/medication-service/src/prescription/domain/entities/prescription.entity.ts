export enum FrequencyType {
  DAILY = 'DAILY',
  CUSTOM = 'CUSTOM',
  INTERVAL_HOURS = 'INTERVAL_HOURS',
}

export class Prescription {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly medicationId: string,
    public readonly dose: number,
    public readonly unit: string,
    public readonly frequency: FrequencyType,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly intervalHours?: number,
    public readonly customSchedule?: string[],
  ) {}

  static create(props: {
    id: string;
    patientId: string;
    medicationId: string;
    dose: number;
    unit: string;
    frequency: FrequencyType;
    startDate: Date;
    endDate: Date;
    intervalHours?: number;
    customSchedule?: string[];
  }): Prescription {
    return new Prescription(
      props.id,
      props.patientId,
      props.medicationId,
      props.dose,
      props.unit,
      props.frequency,
      props.startDate,
      props.endDate,
      props.intervalHours,
      props.customSchedule,
    );
  }
}

