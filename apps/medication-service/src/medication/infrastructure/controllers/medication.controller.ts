import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateMedicationDto } from '../../application/dto/create-medication.dto';
import { UpdateMedicationDto } from '../../application/dto/update-medication.dto';
import { CreateMedicationUseCase } from '../../application/use-cases/create-medication.use-case';
import { GetMedicationUseCase } from '../../application/use-cases/get-medication.use-case';
import { ListMedicationsUseCase } from '../../application/use-cases/list-medications.use-case';
import { UpdateMedicationUseCase } from '../../application/use-cases/update-medication.use-case';
import { DeleteMedicationUseCase } from '../../application/use-cases/delete-medication.use-case';
import { Medication } from '../../domain/entities/medication.entity';

@ApiTags('Medications')
@Controller('medications')
export class MedicationController {
  constructor(
    private readonly createMedicationUseCase: CreateMedicationUseCase,
    private readonly getMedicationUseCase: GetMedicationUseCase,
    private readonly listMedicationsUseCase: ListMedicationsUseCase,
    private readonly updateMedicationUseCase: UpdateMedicationUseCase,
    private readonly deleteMedicationUseCase: DeleteMedicationUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo medicamento' })
  @ApiResponse({ status: 201, description: 'Medicamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() dto: CreateMedicationDto): Promise<Medication> {
    return await this.createMedicationUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os medicamentos' })
  @ApiResponse({ status: 200, description: 'Lista de medicamentos' })
  async findAll(): Promise<Medication[]> {
    return await this.listMedicationsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar medicamento por ID' })
  @ApiParam({ name: 'id', description: 'ID do medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento encontrado' })
  @ApiResponse({ status: 404, description: 'Medicamento não encontrado' })
  async findOne(@Param('id') id: string): Promise<Medication> {
    return await this.getMedicationUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar medicamento' })
  @ApiParam({ name: 'id', description: 'ID do medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Medicamento não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMedicationDto,
  ): Promise<Medication> {
    return await this.updateMedicationUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar medicamento' })
  @ApiParam({ name: 'id', description: 'ID do medicamento' })
  @ApiResponse({ status: 204, description: 'Medicamento deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Medicamento não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.deleteMedicationUseCase.execute(id);
  }
}

