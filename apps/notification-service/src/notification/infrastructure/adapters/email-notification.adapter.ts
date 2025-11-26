import { Injectable, Logger } from '@nestjs/common';
import { NotificationAdapterPort, NotificationData } from '../../domain/ports/notification-adapter.port';

@Injectable()
export class EmailNotificationAdapter implements NotificationAdapterPort {
  private readonly logger = new Logger(EmailNotificationAdapter.name);

  async send(data: NotificationData): Promise<boolean> {
    try {
      // TODO: Implementar integração com Nodemailer
      // Por enquanto, apenas mock
      this.logger.log(`[MOCK] Email enviado para usuário ${data.userId}`);
      this.logger.log(`[MOCK] Assunto: ${data.title}`);
      this.logger.log(`[MOCK] Conteúdo: ${data.message}`);
      
      // Simular sucesso
      return true;
    } catch (error) {
      this.logger.error('Erro ao enviar email:', error);
      return false;
    }
  }
}

