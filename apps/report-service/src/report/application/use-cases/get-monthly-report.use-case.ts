import { Injectable, Inject } from '@nestjs/common';
import { MonthlyReport } from '../../domain/entities/monthly-report.entity';
import { ReportRepositoryPort } from '../../domain/repositories/report.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class GetMonthlyReportUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepositoryPort,
  ) {}

  async execute(patientId: string, month?: number, year?: number): Promise<MonthlyReport> {
    const now = new Date();
    const targetMonth = month !== undefined ? month : now.getMonth() + 1;
    const targetYear = year !== undefined ? year : now.getFullYear();

    const reportData = await this.reportRepository.getMonthlyReport(
      patientId,
      targetMonth,
      targetYear,
    );
    return MonthlyReport.create(reportData);
  }
}

