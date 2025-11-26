import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ConfirmDoseDto } from '../../application/dto/confirm-dose.dto';
import { ConfirmDoseUseCase } from '../../application/use-cases/confirm-dose.use-case';
import { GetDoseStatusUseCase } from '../../application/use-cases/get-dose-status.use-case';
import { ListPatientDosesUseCase } from '../../application/use-cases/list-patient-doses.use-case';
import { DoseTracking } from '../../domain/entities/dose-tracking.entity';

@ApiTags('Dose Tracking')
@Controller('dose')
export class DoseTrackingController {
  constructor(
    private readonly confirmDoseUseCase: ConfirmDoseUseCase,
    private readonly getDoseStatusUseCase: GetDoseStatusUseCase,
    private readonly listPatientDosesUseCase: ListPatientDosesUseCase,
  ) {}

  @Post('confirm/:doseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar ingestão de dose' })
  @ApiParam({ name: 'doseId', description: 'ID do tracking da dose' })
  @ApiResponse({ status: 200, description: 'Dose confirmada com sucesso' })
  @ApiResponse({ status: 404, description: 'Dose não encontrada' })
  @ApiResponse({ status: 400, description: 'Dose já foi processada' })
  async confirmDose(
    @Param('doseId') doseId: string,
    @Body() dto: ConfirmDoseDto,
  ): Promise<DoseTracking> {
    return await this.confirmDoseUseCase.execute(doseId, dto);
  }

  @Get(':doseId/status')
  @ApiOperation({ summary: 'Obter status de uma dose' })
  @ApiParam({ name: 'doseId', description: 'ID do tracking da dose' })
  @ApiResponse({ status: 200, description: 'Status da dose' })
  @ApiResponse({ status: 404, description: 'Dose não encontrada' })
  async getDoseStatus(@Param('doseId') doseId: string): Promise<DoseTracking> {
    return await this.getDoseStatusUseCase.execute(doseId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Listar histórico de doses de um paciente' })
  @ApiParam({ name: 'patientId', description: 'ID do paciente' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final (ISO string)' })
  @ApiResponse({ status: 200, description: 'Lista de doses do paciente' })
  async listPatientDoses(
    @Param('patientId') patientId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<DoseTracking[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.listPatientDosesUseCase.execute(patientId, start, end);
  }
}

