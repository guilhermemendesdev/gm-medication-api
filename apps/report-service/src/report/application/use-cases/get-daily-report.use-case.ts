import { Injectable, Inject } from '@nestjs/common';
import { DailyReport } from '../../domain/entities/daily-report.entity';
import { ReportRepositoryPort } from '../../domain/repositories/report.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class GetDailyReportUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepositoryPort,
  ) {}

  async execute(patientId: string, date?: Date): Promise<DailyReport> {
    const targetDate = date || new Date();
    const reportData = await this.reportRepository.getDailyReport(patientId, targetDate);
    return DailyReport.create(reportData);
  }
}

