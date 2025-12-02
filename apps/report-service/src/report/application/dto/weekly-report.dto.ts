import { ApiProperty } from '@nestjs/swagger';

export class DailyBreakdownDto {
  @ApiProperty()
  date!: Date;

  @ApiProperty()
  taken!: number;

  @ApiProperty()
  late!: number;

  @ApiProperty()
  missed!: number;
}

export class WeeklyReportDto {
  @ApiProperty({ description: 'ID do paciente' })
  patientId!: string;

  @ApiProperty({ description: 'Início da semana' })
  weekStart!: Date;

  @ApiProperty({ description: 'Fim da semana' })
  weekEnd!: Date;

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

  @ApiProperty({ type: [DailyBreakdownDto], description: 'Breakdown diário' })
  dailyBreakdown!: DailyBreakdownDto[];
}

