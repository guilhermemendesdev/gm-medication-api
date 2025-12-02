import { ApiProperty } from '@nestjs/swagger';

export class DailyReportDto {
  @ApiProperty({ description: 'ID do paciente' })
  patientId!: string;

  @ApiProperty({ description: 'Data do relatório' })
  date!: Date;

  @ApiProperty({ description: 'Quantidade de doses tomadas' })
  dosesTaken!: number;

  @ApiProperty({ description: 'Quantidade de doses tomadas com atraso' })
  dosesLate!: number;

  @ApiProperty({ description: 'Quantidade de doses perdidas' })
  dosesMissed!: number;

  @ApiProperty({ description: 'Total de doses agendadas' })
  totalScheduled!: number;

  @ApiProperty({ description: 'Taxa de adesão (%)' })
  adherenceRate!: number;
}

