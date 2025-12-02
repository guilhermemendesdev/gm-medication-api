import { Module } from '@nestjs/common';
import { NotificationService } from './application/services/notification.service';
import { PushNotificationAdapter } from './infrastructure/adapters/push-notification.adapter';
import { EmailNotificationAdapter } from './infrastructure/adapters/email-notification.adapter';
import { WhatsAppNotificationAdapter } from './infrastructure/adapters/whatsapp-notification.adapter';
import { RabbitMQEventSubscriberAdapter } from './infrastructure/adapters/rabbitmq-event-subscriber.adapter';

@Module({
  providers: [
    NotificationService,
    PushNotificationAdapter,
    EmailNotificationAdapter,
    WhatsAppNotificationAdapter,
    RabbitMQEventSubscriberAdapter,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}


