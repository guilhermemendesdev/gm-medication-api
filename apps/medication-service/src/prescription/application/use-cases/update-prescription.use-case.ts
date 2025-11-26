import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Prescription } from '../../domain/entities/prescription.entity';
import { PrescriptionRepositoryPort } from '../../domain/repositories/prescription.repository.port';
import { UpdatePrescriptionDto } from '../dto/update-prescription.dto';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';

@Injectable()
export class UpdatePrescriptionUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.PRESCRIPTION_REPOSITORY)
    private readonly prescriptionRepository: PrescriptionRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdatePrescriptionDto): Promise<Prescription> {
    const existing = await this.prescriptionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Prescrição com ID ${id} não encontrada`);
    }

    const updateData: any = { ...dto };
    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    return await this.prescriptionRepository.update(id, updateData);
  }
}

