export class OverviewReport {
  constructor(
    public readonly patientId: string,
    public readonly averageAdherenceRate: number,
    public readonly totalDosesTaken: number,
    public readonly totalDosesMissed: number,
    public readonly totalDosesLate: number,
    public readonly mostDelayedHours: Array<{
      hour: string;
      delayCount: number;
      averageDelayMinutes: number;
    }>,
    public readonly currentMonthAdherence: number,
    public readonly last7DaysAdherence: number,
  ) {}

  static create(props: {
    patientId: string;
    averageAdherenceRate: number;
    totalDosesTaken: number;
    totalDosesMissed: number;
    totalDosesLate: number;
    mostDelayedHours: Array<{
      hour: string;
      delayCount: number;
      averageDelayMinutes: number;
    }>;
    currentMonthAdherence: number;
    last7DaysAdherence: number;
  }): OverviewReport {
    return new OverviewReport(
      props.patientId,
      props.averageAdherenceRate,
      props.totalDosesTaken,
      props.totalDosesMissed,
      props.totalDosesLate,
      props.mostDelayedHours,
      props.currentMonthAdherence,
      props.last7DaysAdherence,
    );
  }
}

