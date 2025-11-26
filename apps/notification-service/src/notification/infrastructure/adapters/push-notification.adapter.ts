import { Injectable, Logger } from '@nestjs/common';
import { NotificationAdapterPort, NotificationData } from '../../domain/ports/notification-adapter.port';

@Injectable()
export class PushNotificationAdapter implements NotificationAdapterPort {
  private readonly logger = new Logger(PushNotificationAdapter.name);

  async send(data: NotificationData): Promise<boolean> {
    try {
      // TODO: Implementar integração com Firebase Cloud Messaging ou OneSignal
      // Por enquanto, apenas mock
      this.logger.log(`[MOCK] Push Notification enviada para usuário ${data.userId}`);
      this.logger.log(`[MOCK] Título: ${data.title}`);
      this.logger.log(`[MOCK] Mensagem: ${data.message}`);
      
      // Simular sucesso
      return true;
    } catch (error) {
      this.logger.error('Erro ao enviar push notification:', error);
      return false;
    }
  }
}

