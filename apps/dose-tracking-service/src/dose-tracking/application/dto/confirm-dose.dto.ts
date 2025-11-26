import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ConfirmDoseDto {
  @ApiPropertyOptional({
    description: 'Data e hora em que a dose foi tomada (padrão: agora)',
    example: '2024-01-15T14:30:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  takenAt?: string;
}

