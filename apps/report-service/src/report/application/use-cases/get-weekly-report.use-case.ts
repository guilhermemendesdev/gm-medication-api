import { Injectable, Inject } from '@nestjs/common';
import { WeeklyReport } from '../../domain/entities/weekly-report.entity';
import { ReportRepositoryPort } from '../../domain/repositories/report.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class GetWeeklyReportUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepositoryPort,
  ) {}

  async execute(patientId: string, weekStart?: Date): Promise<WeeklyReport> {
    const startDate = weekStart || this.getWeekStart(new Date());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const reportData = await this.reportRepository.getWeeklyReport(patientId, startDate, endDate);
    return WeeklyReport.create(reportData);
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }
}

