import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreatePrescriptionDto } from '../../application/dto/create-prescription.dto';
import { UpdatePrescriptionDto } from '../../application/dto/update-prescription.dto';
import { CreatePrescriptionUseCase } from '../../application/use-cases/create-prescription.use-case';
import { GetPrescriptionUseCase } from '../../application/use-cases/get-prescription.use-case';
import { ListPrescriptionsUseCase } from '../../application/use-cases/list-prescriptions.use-case';
import { UpdatePrescriptionUseCase } from '../../application/use-cases/update-prescription.use-case';
import { DeletePrescriptionUseCase } from '../../application/use-cases/delete-prescription.use-case';
import { Prescription } from '../../domain/entities/prescription.entity';

@ApiTags('Prescriptions')
@Controller('prescriptions')
export class PrescriptionController {
  constructor(
    private readonly createPrescriptionUseCase: CreatePrescriptionUseCase,
    private readonly getPrescriptionUseCase: GetPrescriptionUseCase,
    private readonly listPrescriptionsUseCase: ListPrescriptionsUseCase,
    private readonly updatePrescriptionUseCase: UpdatePrescriptionUseCase,
    private readonly deletePrescriptionUseCase: DeletePrescriptionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova prescrição' })
  @ApiResponse({ status: 201, description: 'Prescrição criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() dto: CreatePrescriptionDto): Promise<Prescription> {
    return await this.createPrescriptionUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar prescrições' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filtrar por paciente' })
  @ApiResponse({ status: 200, description: 'Lista de prescrições' })
  async findAll(@Query('patientId') patientId?: string): Promise<Prescription[]> {
    return await this.listPrescriptionsUseCase.execute(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar prescrição por ID' })
  @ApiParam({ name: 'id', description: 'ID da prescrição' })
  @ApiResponse({ status: 200, description: 'Prescrição encontrada' })
  @ApiResponse({ status: 404, description: 'Prescrição não encontrada' })
  async findOne(@Param('id') id: string): Promise<Prescription> {
    return await this.getPrescriptionUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar prescrição' })
  @ApiParam({ name: 'id', description: 'ID da prescrição' })
  @ApiResponse({ status: 200, description: 'Prescrição atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Prescrição não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    return await this.updatePrescriptionUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar prescrição' })
  @ApiParam({ name: 'id', description: 'ID da prescrição' })
  @ApiResponse({ status: 204, description: 'Prescrição deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Prescrição não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.deletePrescriptionUseCase.execute(id);
  }
}

