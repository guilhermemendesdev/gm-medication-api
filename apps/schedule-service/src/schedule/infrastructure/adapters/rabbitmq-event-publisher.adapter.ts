import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventPublisherPort } from '../../domain/ports/event-publisher.port';
import { DoseScheduledEvent } from '../../domain/events/dose-scheduled.event';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQEventPublisherAdapter implements EventPublisherPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQEventPublisherAdapter.name);
  private connection: any = null;
  private channel: any = null;
  private readonly exchangeName = 'prescription_events';

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
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

      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });

      this.logger.log('Conectado ao RabbitMQ');
    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async publishDoseScheduled(event: DoseScheduledEvent): Promise<void> {
    if (!this.channel) {
      this.logger.warn('Canal RabbitMQ não disponível, tentando reconectar...');
      await this.connect();
      if (!this.channel) {
        throw new Error('Não foi possível conectar ao RabbitMQ');
      }
    }

    try {
      const message = JSON.stringify({
        doseScheduleId: event.doseScheduleId,
        prescriptionId: event.prescriptionId,
        patientId: event.patientId,
        scheduledAt: event.scheduledAt.toISOString(),
      });

      this.channel.publish(this.exchangeName, 'dose.scheduled', Buffer.from(message), {
        persistent: true,
      });

      this.logger.log(`Evento DoseScheduled publicado: ${event.doseScheduleId}`);
    } catch (error) {
      this.logger.error('Erro ao publicar evento:', error);
      throw error;
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

