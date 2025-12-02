export class MonthlyReport {
  constructor(
    public readonly patientId: string,
    public readonly month: number,
    public readonly year: number,
    public readonly totalDosesTaken: number,
    public readonly totalDosesLate: number,
    public readonly totalDosesMissed: number,
    public readonly totalScheduled: number,
    public readonly adherenceRate: number,
    public readonly weeklyBreakdown: Array<{
      weekStart: Date;
      weekEnd: Date;
      adherenceRate: number;
    }>,
  ) {}

  static create(props: {
    patientId: string;
    month: number;
    year: number;
    totalDosesTaken: number;
    totalDosesLate: number;
    totalDosesMissed: number;
    totalScheduled: number;
    weeklyBreakdown: Array<{
      weekStart: Date;
      weekEnd: Date;
      adherenceRate: number;
    }>;
  }): MonthlyReport {
    const adherenceRate =
      props.totalScheduled > 0
        ? ((props.totalDosesTaken / props.totalScheduled) * 100).toFixed(2)
        : 0;

    return new MonthlyReport(
      props.patientId,
      props.month,
      props.year,
      props.totalDosesTaken,
      props.totalDosesLate,
      props.totalDosesMissed,
      props.totalScheduled,
      parseFloat(adherenceRate),
      props.weeklyBreakdown,
    );
  }
}

