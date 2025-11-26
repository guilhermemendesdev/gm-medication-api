import { Module } from '@nestjs/common';
import { PrescriptionController } from './infrastructure/controllers/prescription.controller';
import { CreatePrescriptionUseCase } from './application/use-cases/create-prescription.use-case';
import { GetPrescriptionUseCase } from './application/use-cases/get-prescription.use-case';
import { ListPrescriptionsUseCase } from './application/use-cases/list-prescriptions.use-case';
import { UpdatePrescriptionUseCase } from './application/use-cases/update-prescription.use-case';
import { DeletePrescriptionUseCase } from './application/use-cases/delete-prescription.use-case';
import { PrismaPrescriptionRepositoryAdapter } from './infrastructure/adapters/prisma-prescription.repository.adapter';
import { RabbitMQEventPublisherAdapter } from './infrastructure/adapters/rabbitmq-event-publisher.adapter';
import { INJECTION_TOKENS } from './domain/repositories/injection.tokens';
import { INJECTION_TOKENS as EVENT_INJECTION_TOKENS } from './domain/ports/injection.tokens';

@Module({
  controllers: [PrescriptionController],
  providers: [
    CreatePrescriptionUseCase,
    GetPrescriptionUseCase,
    ListPrescriptionsUseCase,
    UpdatePrescriptionUseCase,
    DeletePrescriptionUseCase,
    {
      provide: INJECTION_TOKENS.PRESCRIPTION_REPOSITORY,
      useClass: PrismaPrescriptionRepositoryAdapter,
    },
    {
      provide: EVENT_INJECTION_TOKENS.EVENT_PUBLISHER,
      useClass: RabbitMQEventPublisherAdapter,
    },
  ],
  exports: [],
})
export class PrescriptionModule {}

