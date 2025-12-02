import { Injectable } from '@nestjs/common';
import { ReportRepositoryPort } from '../../domain/repositories/report.repository.port';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaReportRepositoryAdapter implements ReportRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyReport(patientId: string, date: Date): Promise<any> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Buscar trackings do dia
    const trackings = await this.prisma.doseTracking.findMany({
      where: {
        patientId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const dosesTaken = trackings.filter((t) => t.status === 'TAKEN').length;
    const dosesLate = trackings.filter((t) => t.status === 'LATE').length;
    const dosesMissed = trackings.filter((t) => t.status === 'MISSED').length;
    const totalScheduled = trackings.length;

    return {
      patientId,
      date,
      dosesTaken,
      dosesLate,
      dosesMissed,
      totalScheduled,
    };
  }

  async getWeeklyReport(patientId: string, weekStart: Date, weekEnd: Date): Promise<any> {
    const trackings = await this.prisma.doseTracking.findMany({
      where: {
        patientId,
        scheduledAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    const totalDosesTaken = trackings.filter((t) => t.status === 'TAKEN').length;
    const totalDosesLate = trackings.filter((t) => t.status === 'LATE').length;
    const totalDosesMissed = trackings.filter((t) => t.status === 'MISSED').length;
    const totalScheduled = trackings.length;

    // Agrupar por dia
    const dailyBreakdown = this.groupByDay(trackings);

    return {
      patientId,
      weekStart,
      weekEnd,
      totalDosesTaken,
      totalDosesLate,
      totalDosesMissed,
      totalScheduled,
      dailyBreakdown,
    };
  }

  async getMonthlyReport(patientId: string, month: number, year: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const trackings = await this.prisma.doseTracking.findMany({
      where: {
        patientId,
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalDosesTaken = trackings.filter((t) => t.status === 'TAKEN').length;
    const totalDosesLate = trackings.filter((t) => t.status === 'LATE').length;
    const totalDosesMissed = trackings.filter((t) => t.status === 'MISSED').length;
    const totalScheduled = trackings.length;

    // Agrupar por semana
    const weeklyBreakdown = this.groupByWeek(trackings, startDate, endDate);

    return {
      patientId,
      month,
      year,
      totalDosesTaken,
      totalDosesLate,
      totalDosesMissed,
      totalScheduled,
      weeklyBreakdown,
    };
  }

  async getOverviewReport(patientId: string): Promise<any> {
    // Buscar todos os trackings do paciente
    const trackings = await this.prisma.doseTracking.findMany({
      where: { patientId },
    });

    const totalDosesTaken = trackings.filter((t) => t.status === 'TAKEN' || t.status === 'LATE')
      .length;
    const totalDosesMissed = trackings.filter((t) => t.status === 'MISSED').length;
    const totalDosesLate = trackings.filter((t) => t.status === 'LATE').length;

    const averageAdherenceRate =
      trackings.length > 0 ? (totalDosesTaken / trackings.length) * 100 : 0;

    // Calcular horários com maior atraso
    const delayedTrackings = trackings.filter((t) => t.status === 'LATE' && t.delayInMinutes);
    const mostDelayedHours = this.calculateMostDelayedHours(delayedTrackings);

    // Adesão do mês atual
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthTrackings = trackings.filter(
      (t) =>
        t.scheduledAt >= monthStart &&
        t.scheduledAt <= monthEnd &&
        (t.status === 'TAKEN' || t.status === 'LATE'),
    );
    const currentMonthAdherence =
      trackings.filter((t) => t.scheduledAt >= monthStart && t.scheduledAt <= monthEnd).length > 0
        ? (monthTrackings.length /
            trackings.filter((t) => t.scheduledAt >= monthStart && t.scheduledAt <= monthEnd)
              .length) *
          100
        : 0;

    // Adesão dos últimos 7 dias
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DaysTrackings = trackings.filter(
      (t) =>
        t.scheduledAt >= sevenDaysAgo &&
        (t.status === 'TAKEN' || t.status === 'LATE'),
    );
    const last7DaysAdherence =
      trackings.filter((t) => t.scheduledAt >= sevenDaysAgo).length > 0
        ? (last7DaysTrackings.length /
            trackings.filter((t) => t.scheduledAt >= sevenDaysAgo).length) *
          100
        : 0;

    return {
      patientId,
      averageAdherenceRate: parseFloat(averageAdherenceRate.toFixed(2)),
      totalDosesTaken,
      totalDosesMissed,
      totalDosesLate,
      mostDelayedHours,
      currentMonthAdherence: parseFloat(currentMonthAdherence.toFixed(2)),
      last7DaysAdherence: parseFloat(last7DaysAdherence.toFixed(2)),
    };
  }

  async getTimelineEvents(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    const where: any = { patientId };
    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) where.scheduledAt.gte = startDate;
      if (endDate) where.scheduledAt.lte = endDate;
    }

    const trackings = await this.prisma.doseTracking.findMany({
      where,
      orderBy: {
        scheduledAt: 'desc',
      },
      take: 100, // Limitar a 100 eventos
    });

    // Buscar informações dos medicamentos via schedule -> prescription -> medication
    const schedules = await this.prisma.doseSchedule.findMany({
      where: {
        id: {
          in: trackings.map((t) => t.doseScheduleId),
        },
      },
    });

    const scheduleMap = new Map(schedules.map((s) => [s.id, s]));

    const prescriptionIds = Array.from(new Set(schedules.map((s) => s.prescriptionId)));
    const prescriptions = await this.prisma.prescription.findMany({
      where: {
        id: {
          in: prescriptionIds,
        },
        include: {
          medication: true,
        },
      },
    });

    const prescriptionMap = new Map(prescriptions.map((p) => [p.id, p]));

    const events = trackings.map((tracking) => {
      const schedule = scheduleMap.get(tracking.doseScheduleId);
      let medicationName = 'Medicamento';
      let dose = '';

      if (schedule) {
        const prescription = prescriptionMap.get(schedule.prescriptionId);
        if (prescription) {
          medicationName = prescription.medication.name;
          dose = `${prescription.dose} ${prescription.unit}`;
        }
      }

      return {
        id: tracking.id,
        type: tracking.status,
        scheduledAt: tracking.scheduledAt,
        occurredAt: tracking.takenAt,
        delayInMinutes: tracking.delayInMinutes,
        medicationName,
        dose,
      };
    });

    return events;
  }

  private groupByDay(trackings: any[]): Array<{ date: Date; taken: number; late: number; missed: number }> {
    const grouped = new Map<string, { taken: number; late: number; missed: number }>();

    trackings.forEach((tracking) => {
      const dateKey = tracking.scheduledAt.toISOString().split('T')[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, { taken: 0, late: 0, missed: 0 });
      }

      const dayData = grouped.get(dateKey)!;
      if (tracking.status === 'TAKEN') dayData.taken++;
      else if (tracking.status === 'LATE') dayData.late++;
      else if (tracking.status === 'MISSED') dayData.missed++;
    });

    return Array.from(grouped.entries()).map(([dateStr, data]) => ({
      date: new Date(dateStr),
      taken: data.taken,
      late: data.late,
      missed: data.missed,
    }));
  }

  private groupByWeek(trackings: any[], startDate: Date, endDate: Date): Array<{
    weekStart: Date;
    weekEnd: Date;
    adherenceRate: number;
  }> {
    const weeks: Array<{ weekStart: Date; weekEnd: Date; trackings: any[] }> = [];
    let currentWeekStart = new Date(startDate);

    while (currentWeekStart <= endDate) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekTrackings = trackings.filter(
        (t) => t.scheduledAt >= currentWeekStart && t.scheduledAt <= weekEnd,
      );

      weeks.push({
        weekStart: new Date(currentWeekStart),
        weekEnd: new Date(weekEnd),
        trackings: weekTrackings,
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return weeks.map((week) => {
      const taken = week.trackings.filter((t) => t.status === 'TAKEN' || t.status === 'LATE')
        .length;
      const total = week.trackings.length;
      const adherenceRate = total > 0 ? parseFloat(((taken / total) * 100).toFixed(2)) : 0;

      return {
        weekStart: week.weekStart,
        weekEnd: week.weekEnd,
        adherenceRate,
      };
    });
  }

  private calculateMostDelayedHours(delayedTrackings: any[]): Array<{
    hour: string;
    delayCount: number;
    averageDelayMinutes: number;
  }> {
    const hourMap = new Map<
      string,
      { count: number; totalDelay: number }
    >();

    delayedTrackings.forEach((tracking) => {
      const hour = new Date(tracking.scheduledAt).getHours().toString().padStart(2, '0') + ':00';
      if (!hourMap.has(hour)) {
        hourMap.set(hour, { count: 0, totalDelay: 0 });
      }

      const hourData = hourMap.get(hour)!;
      hourData.count++;
      hourData.totalDelay += tracking.delayInMinutes || 0;
    });

    return Array.from(hourMap.entries())
      .map(([hour, data]) => ({
        hour,
        delayCount: data.count,
        averageDelayMinutes: parseFloat((data.totalDelay / data.count).toFixed(2)),
      }))
      .sort((a, b) => b.delayCount - a.delayCount)
      .slice(0, 5);
  }
}

