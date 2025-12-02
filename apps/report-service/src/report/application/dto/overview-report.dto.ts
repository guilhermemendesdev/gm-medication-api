import { ApiProperty } from '@nestjs/swagger';

export class MostDelayedHourDto {
  @ApiProperty({ description: 'Horário (HH:mm)' })
  hour!: string;

  @ApiProperty({ description: 'Quantidade de atrasos' })
  delayCount!: number;

  @ApiProperty({ description: 'Média de atraso em minutos' })
  averageDelayMinutes!: number;
}

export class OverviewReportDto {
  @ApiProperty({ description: 'ID do paciente' })
  patientId!: string;

  @ApiProperty({ description: 'Taxa de adesão média (%)' })
  averageAdherenceRate!: number;

  @ApiProperty({ description: 'Total de doses tomadas' })
  totalDosesTaken!: number;

  @ApiProperty({ description: 'Total de doses perdidas' })
  totalDosesMissed!: number;

  @ApiProperty({ description: 'Total de doses atrasadas' })
  totalDosesLate!: number;

  @ApiProperty({ type: [MostDelayedHourDto], description: 'Horários com maior incidência de atraso' })
  mostDelayedHours!: MostDelayedHourDto[];

  @ApiProperty({ description: 'Adesão do mês atual (%)' })
  currentMonthAdherence!: number;

  @ApiProperty({ description: 'Adesão dos últimos 7 dias (%)' })
  last7DaysAdherence!: number;
}

