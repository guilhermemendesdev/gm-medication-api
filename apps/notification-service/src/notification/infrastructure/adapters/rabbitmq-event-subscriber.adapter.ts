import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { NotificationService, NotificationType, NotificationEventType } from '../../application/services/notification.service';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQEventSubscriberAdapter implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQEventSubscriberAdapter.name);
  private connection: any = null;
  private channel: any = null;
  private readonly exchangeNamePrescription = 'prescription_events';
  private readonly exchangeNameDoseTracking = 'dose_tracking_events';
  private readonly queueNameScheduled = 'dose.scheduled.notification';
  private readonly queueNameMissed = 'dose.missed.notification';

  constructor(private readonly notificationService: NotificationService) {}

  async onModuleInit() {
    await Promise.all([
      this.subscribeToDoseScheduled(),
      this.subscribeToDoseMissed(),
    ]);
  }

  async subscribeToDoseScheduled(): Promise<void> {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
      this.connection = await amqp.connect(rabbitmqUrl);

      if (!this.connection) {
        throw new Error('Falha ao estabelecer conexão com RabbitMQ');
      }

      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Falha ao criar canal RabbitMQ');
      }

      await this.channel.assertExchange(this.exchangeNamePrescription, 'topic', { durable: true });
      await this.channel.assertQueue(this.queueNameScheduled, { durable: true });
      await this.channel.bindQueue(this.queueNameScheduled, this.exchangeNamePrescription, 'dose.scheduled');

      await this.channel.consume(
        this.queueNameScheduled,
        async (msg: amqp.ConsumeMessage | null) => {
          if (msg && this.channel) {
            try {
              const content = JSON.parse(msg.content.toString());
              this.logger.log(`Evento DoseScheduled recebido: ${content.doseScheduleId}`);

              // Enviar notificação de lembrete
              const scheduledDate = new Date(content.scheduledAt);
              const hours = scheduledDate.getHours().toString().padStart(2, '0');
              const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');

              await this.notificationService.sendNotification(
                content.patientId,
                NotificationType.PUSH,
                NotificationEventType.SCHEDULED,
                'Lembrete de Medicação',
                `Você tem uma medicação agendada para ${hours}:${minutes}. Não esqueça de tomar!`,
                {
                  doseScheduleId: content.doseScheduleId,
                  scheduledAt: content.scheduledAt,
                },
              );

              this.channel.ack(msg);
            } catch (error) {
              this.logger.error('Erro ao processar evento DoseScheduled:', error);
              if (this.channel && msg) {
                this.channel.nack(msg, false, false);
              }
            }
          }
        },
        { noAck: false },
      );

      this.logger.log('Subscrito ao evento DoseScheduled');
    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ para DoseScheduled:', error);
      setTimeout(() => this.subscribeToDoseScheduled(), 5000);
    }
  }

  async subscribeToDoseMissed(): Promise<void> {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
      
      if (!this.connection) {
        this.connection = await amqp.connect(rabbitmqUrl);
      }

      if (!this.channel) {
        this.channel = await this.connection.createChannel();
      }

      await this.channel.assertExchange(this.exchangeNameDoseTracking, 'topic', { durable: true });
      await this.channel.assertQueue(this.queueNameMissed, { durable: true });
      await this.channel.bindQueue(this.queueNameMissed, this.exchangeNameDoseTracking, 'dose.missed');

      await this.channel.consume(
        this.queueNameMissed,
        async (msg: amqp.ConsumeMessage | null) => {
          if (msg && this.channel) {
            try {
              const content = JSON.parse(msg.content.toString());
              this.logger.log(`Evento DoseMissed recebido: ${content.doseTrackingId}`);

              // Enviar alerta para cuidador se houver
              if (content.caregiverId) {
                await this.notificationService.sendNotification(
                  content.caregiverId,
                  NotificationType.PUSH,
                  NotificationEventType.MISSED,
                  'Alerta: Dose Perdida',
                  `O paciente não tomou a medicação agendada para ${new Date(content.scheduledAt).toLocaleString('pt-BR')}.`,
                  {
                    doseTrackingId: content.doseTrackingId,
                    patientId: content.patientId,
                    scheduledAt: content.scheduledAt,
                  },
                );

                // Também enviar por WhatsApp ou Email
                await this.notificationService.sendNotification(
                  content.caregiverId,
                  NotificationType.EMAIL,
                  NotificationEventType.MISSED,
                  'Alerta: Dose Perdida',
                  `O paciente não tomou a medicação agendada para ${new Date(content.scheduledAt).toLocaleString('pt-BR')}.`,
                  {
                    doseTrackingId: content.doseTrackingId,
                    patientId: content.patientId,
                    scheduledAt: content.scheduledAt,
                  },
                );
              }

              // Notificar o paciente também
              await this.notificationService.sendNotification(
                content.patientId,
                NotificationType.PUSH,
                NotificationEventType.MISSED,
                'Medicação Perdida',
                'Você perdeu uma dose da sua medicação. Entre em contato com seu médico se necessário.',
                {
                  doseTrackingId: content.doseTrackingId,
                  scheduledAt: content.scheduledAt,
                },
              );

              this.channel.ack(msg);
            } catch (error) {
              this.logger.error('Erro ao processar evento DoseMissed:', error);
              if (this.channel && msg) {
                this.channel.nack(msg, false, false);
              }
            }
          }
        },
        { noAck: false },
      );

      this.logger.log('Subscrito ao evento DoseMissed');
    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ para DoseMissed:', error);
      setTimeout(() => this.subscribeToDoseMissed(), 5000);
    }
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      this.logger.error('Erro ao fechar conexão RabbitMQ:', error);
    }
  }
}


