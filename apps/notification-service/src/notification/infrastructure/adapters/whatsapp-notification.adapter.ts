import { Injectable, Logger } from '@nestjs/common';
import { NotificationAdapterPort, NotificationData } from '../../domain/ports/notification-adapter.port';

@Injectable()
export class WhatsAppNotificationAdapter implements NotificationAdapterPort {
  private readonly logger = new Logger(WhatsAppNotificationAdapter.name);

  async send(data: NotificationData): Promise<boolean> {
    try {
      // TODO: Implementar integração com Twilio ou Meta WhatsApp Cloud API
      // Por enquanto, apenas mock
      this.logger.log(`[MOCK] WhatsApp enviado para usuário ${data.userId}`);
      this.logger.log(`[MOCK] Mensagem: ${data.message}`);
      
      // Simular sucesso
      return true;
    } catch (error) {
      this.logger.error('Erro ao enviar WhatsApp:', error);
      return false;
    }
  }
}

