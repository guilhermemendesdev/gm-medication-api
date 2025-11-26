import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ListSchedulesUseCase } from '../../application/use-cases/list-schedules.use-case';
import { DoseSchedule } from '../../domain/entities/dose-schedule.entity';

@ApiTags('Schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly listSchedulesUseCase: ListSchedulesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos de doses' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filtrar por paciente' })
  @ApiQuery({
    name: 'prescriptionId',
    required: false,
    description: 'Filtrar por prescrição',
  })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos' })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('prescriptionId') prescriptionId?: string,
  ): Promise<DoseSchedule[]> {
    return await this.listSchedulesUseCase.execute(patientId, prescriptionId);
  }
}

