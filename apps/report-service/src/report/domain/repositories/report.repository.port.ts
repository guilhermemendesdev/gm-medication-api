export interface DailyReportData {
  patientId: string;
  date: Date;
  dosesTaken: number;
  dosesLate: number;
  dosesMissed: number;
  totalScheduled: number;
}

export interface WeeklyReportData {
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
}

export interface MonthlyReportData {
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
}

export interface TimelineEventData {
  id: string;
  type: string;
  scheduledAt: Date;
  occurredAt: Date | null;
  delayInMinutes: number | null;
  medicationName?: string;
  dose?: string;
}

export interface ReportRepositoryPort {
  getDailyReport(patientId: string, date: Date): Promise<DailyReportData>;
  getWeeklyReport(patientId: string, weekStart: Date, weekEnd: Date): Promise<WeeklyReportData>;
  getMonthlyReport(patientId: string, month: number, year: number): Promise<MonthlyReportData>;
  getOverviewReport(patientId: string): Promise<any>;
  getTimelineEvents(patientId: string, startDate?: Date, endDate?: Date): Promise<TimelineEventData[]>;
}

