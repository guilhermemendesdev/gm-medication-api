import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FrequencyType } from '../../domain/entities/prescription.entity';

export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'ID do paciente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({
    description: 'ID do medicamento',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  medicationId!: string;

  @ApiProperty({
    description: 'Dose do medicamento',
    example: 500,
  })
  @IsNumber()
  @Min(0)
  dose!: number;

  @ApiProperty({
    description: 'Unidade da dose',
    example: 'mg',
  })
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiProperty({
    description: 'Frequência de administração',
    enum: FrequencyType,
    example: FrequencyType.DAILY,
  })
  @IsEnum(FrequencyType)
  frequency!: FrequencyType;

  @ApiProperty({
    description: 'Data de início da prescrição',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    description: 'Data de fim da prescrição',
    example: '2024-01-31T23:59:59.000Z',
  })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({
    description: 'Intervalo em horas (para frequência INTERVAL_HOURS)',
    example: 8,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  intervalHours?: number;

  @ApiPropertyOptional({
    description: 'Horários customizados (para frequência CUSTOM)',
    example: ['08:00', '14:00', '20:00'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  customSchedule?: string[];
}

