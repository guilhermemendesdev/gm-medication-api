export enum TimelineEventType {
  TAKEN = 'TAKEN',
  LATE = 'LATE',
  MISSED = 'MISSED',
}

export class TimelineEvent {
  constructor(
    public readonly id: string,
    public readonly type: TimelineEventType,
    public readonly scheduledAt: Date,
    public readonly occurredAt: Date | null,
    public readonly delayInMinutes: number | null,
    public readonly medicationName?: string,
    public readonly dose?: string,
  ) {}

  static create(props: {
    id: string;
    type: TimelineEventType;
    scheduledAt: Date;
    occurredAt: Date | null;
    delayInMinutes: number | null;
    medicationName?: string;
    dose?: string;
  }): TimelineEvent {
    return new TimelineEvent(
      props.id,
      props.type,
      props.scheduledAt,
      props.occurredAt,
      props.delayInMinutes,
      props.medicationName,
      props.dose,
    );
  }
}

