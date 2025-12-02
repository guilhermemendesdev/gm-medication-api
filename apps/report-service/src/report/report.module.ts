import { Module } from '@nestjs/common';
import { ReportController } from './infrastructure/controllers/report.controller';
import { GetDailyReportUseCase } from './application/use-cases/get-daily-report.use-case';
import { GetWeeklyReportUseCase } from './application/use-cases/get-weekly-report.use-case';
import { GetMonthlyReportUseCase } from './application/use-cases/get-monthly-report.use-case';
import { GetOverviewReportUseCase } from './application/use-cases/get-overview-report.use-case';
import { GetTimelineEventsUseCase } from './application/use-cases/get-timeline-events.use-case';
import { PrismaReportRepositoryAdapter } from './infrastructure/adapters/prisma-report.repository.adapter';
import { INJECTION_TOKENS } from './domain/repositories/injection.tokens';
import { CacheModule } from '../infrastructure/cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [ReportController],
  providers: [
    GetDailyReportUseCase,
    GetWeeklyReportUseCase,
    GetMonthlyReportUseCase,
    GetOverviewReportUseCase,
    GetTimelineEventsUseCase,
    {
      provide: INJECTION_TOKENS.REPORT_REPOSITORY,
      useClass: PrismaReportRepositoryAdapter,
    },
  ],
  exports: [],
})
export class ReportModule {}

