import { Injectable, Logger } from '@nestjs/common';
import { NotificationAdapterPort, NotificationData } from '../../domain/ports/notification-adapter.port';
import { PushNotificationAdapter } from '../../infrastructure/adapters/push-notification.adapter';
import { EmailNotificationAdapter } from '../../infrastructure/adapters/email-notification.adapter';
import { WhatsAppNotificationAdapter } from '../../infrastructure/adapters/whatsapp-notification.adapter';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

export enum NotificationType {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
}

export enum NotificationEventType {
  SCHEDULED = 'SCHEDULED',
  MISSED = 'MISSED',
  REMINDER = 'REMINDER',
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly adapters: Map<NotificationType, NotificationAdapterPort>;

  constructor(
    private readonly pushAdapter: PushNotificationAdapter,
    private readonly emailAdapter: EmailNotificationAdapter,
    private readonly whatsappAdapter: WhatsAppNotificationAdapter,
    private readonly prisma: PrismaService,
  ) {
    this.adapters = new Map([
      [NotificationType.PUSH, pushAdapter],
      [NotificationType.EMAIL, emailAdapter],
      [NotificationType.WHATSAPP, whatsappAdapter],
    ]);
  }

  async sendNotification(
    userId: string,
    type: NotificationType,
    eventType: NotificationEventType,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const adapter = this.adapters.get(type);
    if (!adapter) {
      this.logger.error(`Adapter não encontrado para o tipo: ${type}`);
      await this.logNotification(userId, type, eventType, title, message, false, `Adapter não encontrado`);
      return;
    }

    try {
      const notificationData: NotificationData = {
        userId,
        title,
        message,
        metadata,
      };

      const success = await adapter.send(notificationData);

      await this.logNotification(userId, type, eventType, title, message, success, success ? null : 'Falha ao enviar');

      if (success) {
        this.logger.log(`Notificação ${type} enviada com sucesso para usuário ${userId}`);
      } else {
        this.logger.warn(`Falha ao enviar notificação ${type} para usuário ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação ${type}:`, error);
      await this.logNotification(userId, type, eventType, title, message, false, error instanceof Error ? error.message : 'Erro desconhecido');
    }
  }

  private async logNotification(
    userId: string,
    type: NotificationType,
    eventType: NotificationEventType,
    title: string,
    message: string,
    success: boolean,
    errorMessage?: string | null,
  ): Promise<void> {
    try {
      await this.prisma.notificationLog.create({
        data: {
          userId,
          type: type as any,
          eventType: eventType as any,
          notificationContent: JSON.stringify({ title, message }),
          status: success ? 'SUCCESS' : 'FAIL',
          errorMessage: errorMessage || null,
        },
      });
    } catch (error) {
      this.logger.error('Erro ao registrar log de notificação:', error);
    }
  }
}


