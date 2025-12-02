export class DailyReport {
  constructor(
    public readonly patientId: string,
    public readonly date: Date,
    public readonly dosesTaken: number,
    public readonly dosesLate: number,
    public readonly dosesMissed: number,
    public readonly totalScheduled: number,
    public readonly adherenceRate: number,
  ) {}

  static create(props: {
    patientId: string;
    date: Date;
    dosesTaken: number;
    dosesLate: number;
    dosesMissed: number;
    totalScheduled: number;
  }): DailyReport {
    const adherenceRate =
      props.totalScheduled > 0
        ? ((props.dosesTaken / props.totalScheduled) * 100).toFixed(2)
        : 0;

    return new DailyReport(
      props.patientId,
      props.date,
      props.dosesTaken,
      props.dosesLate,
      props.dosesMissed,
      props.totalScheduled,
      parseFloat(adherenceRate),
    );
  }
}

