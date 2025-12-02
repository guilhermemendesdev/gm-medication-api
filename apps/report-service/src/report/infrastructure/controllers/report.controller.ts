import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetDailyReportUseCase } from '../../application/use-cases/get-daily-report.use-case';
import { GetWeeklyReportUseCase } from '../../application/use-cases/get-weekly-report.use-case';
import { GetMonthlyReportUseCase } from '../../application/use-cases/get-monthly-report.use-case';
import { GetOverviewReportUseCase } from '../../application/use-cases/get-overview-report.use-case';
import { GetTimelineEventsUseCase } from '../../application/use-cases/get-timeline-events.use-case';
import { DailyReportDto } from '../../application/dto/daily-report.dto';
import { WeeklyReportDto } from '../../application/dto/weekly-report.dto';
import { MonthlyReportDto } from '../../application/dto/monthly-report.dto';
import { OverviewReportDto } from '../../application/dto/overview-report.dto';
import { TimelineEventDto } from '../../application/dto/timeline-event.dto';

@ApiTags('Reports')
@Controller('reports')
@UseInterceptors(CacheInterceptor)
export class ReportController {
  constructor(
    private readonly getDailyReportUseCase: GetDailyReportUseCase,
    private readonly getWeeklyReportUseCase: GetWeeklyReportUseCase,
    private readonly getMonthlyReportUseCase: GetMonthlyReportUseCase,
    private readonly getOverviewReportUseCase: GetOverviewReportUseCase,
    private readonly getTimelineEventsUseCase: GetTimelineEventsUseCase,
  ) {}

  @Get('patient/:id/daily')
  @CacheTTL(300)
  @ApiOperation({ summary: 'Obter relatório diário do paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  @ApiQuery({ name: 'date', required: false, description: 'Data (ISO string)', example: '2024-01-15' })
  @ApiResponse({ status: 200, description: 'Relatório diário', type: DailyReportDto })
  async getDailyReport(
    @Param('id') patientId: string,
    @Query('date') date?: string,
  ): Promise<DailyReportDto> {
    const targetDate = date ? new Date(date) : undefined;
    const report = await this.getDailyReportUseCase.execute(patientId, targetDate);
    return {
      patientId: report.patientId,
      date: report.date,
      dosesTaken: report.dosesTaken,
      dosesLate: report.dosesLate,
      dosesMissed: report.dosesMissed,
      totalScheduled: report.totalScheduled,
      adherenceRate: report.adherenceRate,
    };
  }

  @Get('patient/:id/weekly')
  @CacheTTL(300)
  @ApiOperation({ summary: 'Obter relatório semanal do paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  @ApiQuery({ name: 'weekStart', required: false, description: 'Início da semana (ISO string)' })
  @ApiResponse({ status: 200, description: 'Relatório semanal', type: WeeklyReportDto })
  async getWeeklyReport(
    @Param('id') patientId: string,
    @Query('weekStart') weekStart?: string,
  ): Promise<WeeklyReportDto> {
    const startDate = weekStart ? new Date(weekStart) : undefined;
    const report = await this.getWeeklyReportUseCase.execute(patientId, startDate);
    return {
      patientId: report.patientId,
      weekStart: report.weekStart,
      weekEnd: report.weekEnd,
      totalDosesTaken: report.totalDosesTaken,
      totalDosesLate: report.totalDosesLate,
      totalDosesMissed: report.totalDosesMissed,
      totalScheduled: report.totalScheduled,
      adherenceRate: report.adherenceRate,
      dailyBreakdown: report.dailyBreakdown.map((day) => ({
        date: day.date,
        taken: day.taken,
        late: day.late,
        missed: day.missed,
      })),
    };
  }

  @Get('patient/:id/monthly')
  @CacheTTL(300)
  @ApiOperation({ summary: 'Obter relatório mensal do paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  @ApiQuery({ name: 'month', required: false, description: 'Mês (1-12)' })
  @ApiQuery({ name: 'year', required: false, description: 'Ano' })
  @ApiResponse({ status: 200, description: 'Relatório mensal', type: MonthlyReportDto })
  async getMonthlyReport(
    @Param('id') patientId: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ): Promise<MonthlyReportDto> {
    const monthNum = month ? parseInt(month, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;
    const report = await this.getMonthlyReportUseCase.execute(patientId, monthNum, yearNum);
    return {
      patientId: report.patientId,
      month: report.month,
      year: report.year,
      totalDosesTaken: report.totalDosesTaken,
      totalDosesLate: report.totalDosesLate,
      totalDosesMissed: report.totalDosesMissed,
      totalScheduled: report.totalScheduled,
      adherenceRate: report.adherenceRate,
      weeklyBreakdown: report.weeklyBreakdown.map((week) => ({
        weekStart: week.weekStart,
        weekEnd: week.weekEnd,
        adherenceRate: week.adherenceRate,
      })),
    };
  }

  @Get('patient/:id/overview')
  @CacheTTL(300)
  @ApiOperation({ summary: 'Obter visão geral (KPIs) do paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  @ApiResponse({ status: 200, description: 'Visão geral do paciente', type: OverviewReportDto })
  async getOverviewReport(@Param('id') patientId: string): Promise<OverviewReportDto> {
    const report = await this.getOverviewReportUseCase.execute(patientId);
    return {
      patientId: report.patientId,
      averageAdherenceRate: report.averageAdherenceRate,
      totalDosesTaken: report.totalDosesTaken,
      totalDosesMissed: report.totalDosesMissed,
      totalDosesLate: report.totalDosesLate,
      mostDelayedHours: report.mostDelayedHours.map((h) => ({
        hour: h.hour,
        delayCount: h.delayCount,
        averageDelayMinutes: h.averageDelayMinutes,
      })),
      currentMonthAdherence: report.currentMonthAdherence,
      last7DaysAdherence: report.last7DaysAdherence,
    };
  }

  @Get('patient/:id/timeline')
  @CacheTTL(60)
  @ApiOperation({ summary: 'Obter timeline de eventos do paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final (ISO string)' })
  @ApiResponse({ status: 200, description: 'Timeline de eventos', type: [TimelineEventDto] })
  async getTimeline(
    @Param('id') patientId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<TimelineEventDto[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const events = await this.getTimelineEventsUseCase.execute(patientId, start, end);
    return events.map((event) => ({
      id: event.id,
      type: event.type as any,
      scheduledAt: event.scheduledAt,
      occurredAt: event.occurredAt,
      delayInMinutes: event.delayInMinutes,
      medicationName: event.medicationName,
      dose: event.dose,
    }));
  }
}

