import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DoseTrackingController } from './infrastructure/controllers/dose-tracking.controller';
import { ConfirmDoseUseCase } from './application/use-cases/confirm-dose.use-case';
import { MarkMissedDoseUseCase } from './application/use-cases/mark-missed-dose.use-case';
import { GetDoseStatusUseCase } from './application/use-cases/get-dose-status.use-case';
import { ListPatientDosesUseCase } from './application/use-cases/list-patient-doses.use-case';
import { CreateDoseTrackingUseCase } from './application/use-cases/create-dose-tracking.use-case';
import { CheckMissedDosesService } from './application/services/check-missed-doses.service';
import { PrismaDoseTrackingRepositoryAdapter } from './infrastructure/adapters/prisma-dose-tracking.repository.adapter';
import { RabbitMQEventPublisherAdapter } from './infrastructure/adapters/rabbitmq-event-publisher.adapter';
import { RabbitMQEventSubscriberAdapter } from './infrastructure/adapters/rabbitmq-event-subscriber.adapter';
import { INJECTION_TOKENS } from './domain/repositories/injection.tokens';
import { INJECTION_TOKENS as EVENT_INJECTION_TOKENS } from './domain/ports/injection.tokens';

@Module({
  imports: [ScheduleModule],
  controllers: [DoseTrackingController],
  providers: [
    ConfirmDoseUseCase,
    MarkMissedDoseUseCase,
    GetDoseStatusUseCase,
    ListPatientDosesUseCase,
    CreateDoseTrackingUseCase,
    CheckMissedDosesService,
    {
      provide: INJECTION_TOKENS.DOSE_TRACKING_REPOSITORY,
      useClass: PrismaDoseTrackingRepositoryAdapter,
    },
    {
      provide: EVENT_INJECTION_TOKENS.EVENT_PUBLISHER,
      useClass: RabbitMQEventPublisherAdapter,
    },
    RabbitMQEventSubscriberAdapter,
  ],
  exports: [],
})
export class DoseTrackingModule {}

