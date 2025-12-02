export class WeeklyReport {
  constructor(
    public readonly patientId: string,
    public readonly weekStart: Date,
    public readonly weekEnd: Date,
    public readonly totalDosesTaken: number,
    public readonly totalDosesLate: number,
    public readonly totalDosesMissed: number,
    public readonly totalScheduled: number,
    public readonly adherenceRate: number,
    public readonly dailyBreakdown: Array<{
      date: Date;
      taken: number;
      late: number;
      missed: number;
    }>,
  ) {}

  static create(props: {
    patientId: string;
    weekStart: Date;
    weekEnd: Date;
    totalDosesTaken: number;
    totalDosesLate: number;
    totalDosesMissed: number;
    totalScheduled: number;
    dailyBreakdown: Array<{
      date: Date;
      taken: number;
      late: number;
      missed: number;
    }>;
  }): WeeklyReport {
    const adherenceRate =
      props.totalScheduled > 0
        ? ((props.totalDosesTaken / props.totalScheduled) * 100).toFixed(2)
        : 0;

    return new WeeklyReport(
      props.patientId,
      props.weekStart,
      props.weekEnd,
      props.totalDosesTaken,
      props.totalDosesLate,
      props.totalDosesMissed,
      props.totalScheduled,
      parseFloat(adherenceRate),
      props.dailyBreakdown,
    );
  }
}

