import { Module } from '@nestjs/common';
import { MedicationController } from './infrastructure/controllers/medication.controller';
import { CreateMedicationUseCase } from './application/use-cases/create-medication.use-case';
import { GetMedicationUseCase } from './application/use-cases/get-medication.use-case';
import { ListMedicationsUseCase } from './application/use-cases/list-medications.use-case';
import { UpdateMedicationUseCase } from './application/use-cases/update-medication.use-case';
import { DeleteMedicationUseCase } from './application/use-cases/delete-medication.use-case';
import { PrismaMedicationRepositoryAdapter } from './infrastructure/adapters/prisma-medication.repository.adapter';
import { INJECTION_TOKENS } from './domain/repositories/injection.tokens';

@Module({
  controllers: [MedicationController],
  providers: [
    CreateMedicationUseCase,
    GetMedicationUseCase,
    ListMedicationsUseCase,
    UpdateMedicationUseCase,
    DeleteMedicationUseCase,
    {
      provide: INJECTION_TOKENS.MEDICATION_REPOSITORY,
      useClass: PrismaMedicationRepositoryAdapter,
    },
  ],
  exports: [],
})
export class MedicationModule {}

