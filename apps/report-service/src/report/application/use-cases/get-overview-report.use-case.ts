import { Injectable, Inject } from '@nestjs/common';
import { OverviewReport } from '../../domain/entities/overview-report.entity';
import { ReportRepositoryPort } from '../../domain/repositories/report.repository.port';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class GetOverviewReportUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.REPORT_REPOSITORY)
    private readonly reportRepository: ReportRepositoryPort,
  ) {}

  async execute(patientId: string): Promise<OverviewReport> {
    const overviewData = await this.reportRepository.getOverviewReport(patientId);
    return OverviewReport.create(overviewData);
  }
}

