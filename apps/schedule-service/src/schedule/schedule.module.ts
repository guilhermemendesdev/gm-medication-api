import { Module } from '@nestjs/common';
import { ScheduleController } from './infrastructure/controllers/schedule.controller';
import { GenerateScheduleUseCase } from './application/use-cases/generate-schedule.use-case';
import { ListSchedulesUseCase } from './application/use-cases/list-schedules.use-case';
import { PrismaDoseScheduleRepositoryAdapter } from './infrastructure/adapters/prisma-dose-schedule.repository.adapter';
import { RabbitMQEventSubscriberAdapter } from './infrastructure/adapters/rabbitmq-event-subscriber.adapter';
import { RabbitMQEventPublisherAdapter } from './infrastructure/adapters/rabbitmq-event-publisher.adapter';
import { INJECTION_TOKENS } from './domain/repositories/injection.tokens';
import { INJECTION_TOKENS as EVENT_INJECTION_TOKENS } from './domain/ports/injection.tokens';

@Module({
  controllers: [ScheduleController],
  providers: [
    GenerateScheduleUseCase,
    ListSchedulesUseCase,
    {
      provide: INJECTION_TOKENS.DOSE_SCHEDULE_REPOSITORY,
      useClass: PrismaDoseScheduleRepositoryAdapter,
    },
    {
      provide: EVENT_INJECTION_TOKENS.EVENT_PUBLISHER,
      useClass: RabbitMQEventPublisherAdapter,
    },
    RabbitMQEventSubscriberAdapter,
  ],
  exports: [],
})
export class ScheduleModule {}

