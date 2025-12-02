import { ApiProperty } from '@nestjs/swagger';

export class WeeklyBreakdownDto {
  @ApiProperty()
  weekStart!: Date;

  @ApiProperty()
  weekEnd!: Date;

  @ApiProperty()
  adherenceRate!: number;
}

export class MonthlyReportDto {
  @ApiProperty({ description: 'ID do paciente' })
  patientId!: string;

  @ApiProperty({ description: 'Mês (1-12)' })
  month!: number;

  @ApiProperty({ description: 'Ano' })
  year!: number;

  @ApiProperty({ description: 'Total de doses tomadas' })
  totalDosesTaken!: number;

  @ApiProperty({ description: 'Total de doses atrasadas' })
  totalDosesLate!: number;

  @ApiProperty({ description: 'Total de doses perdidas' })
  totalDosesMissed!: number;

  @ApiProperty({ description: 'Total de doses agendadas' })
  totalScheduled!: number;

  @ApiProperty({ description: 'Taxa de adesão (%)' })
  adherenceRate!: number;

  @ApiProperty({ type: [WeeklyBreakdownDto], description: 'Breakdown semanal' })
  weeklyBreakdown!: WeeklyBreakdownDto[];
}

