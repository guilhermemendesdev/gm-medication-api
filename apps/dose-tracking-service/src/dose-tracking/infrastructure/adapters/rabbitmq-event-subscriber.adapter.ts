import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CreateDoseTrackingUseCase } from '../../application/use-cases/create-dose-tracking.use-case';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQEventSubscriberAdapter implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQEventSubscriberAdapter.name);
  private connection: any = null;
  private channel: any = null;
  private readonly exchangeName = 'prescription_events';
  private readonly queueName = 'dose.scheduled.tracking';

  constructor(private readonly createDoseTrackingUseCase: CreateDoseTrackingUseCase) {}

  async onModuleInit() {
    await this.subscribeToDoseScheduled();
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

      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      await this.channel.assertQueue(this.queueName, { durable: true });
      await this.channel.bindQueue(this.queueName, this.exchangeName, 'dose.scheduled');

      await this.channel.consume(
        this.queueName,
        async (msg: amqp.ConsumeMessage | null) => {
          if (msg && this.channel) {
            try {
              const content = JSON.parse(msg.content.toString());
              this.logger.log(`Evento DoseScheduled recebido: ${content.doseScheduleId}`);

              await this.createDoseTrackingUseCase.execute({
                doseScheduleId: content.doseScheduleId,
                scheduledAt: new Date(content.scheduledAt),
                patientId: content.patientId,
              });

              this.channel.ack(msg);
            } catch (error) {
              this.logger.error('Erro ao processar evento:', error);
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
      this.logger.error('Erro ao conectar ao RabbitMQ:', error);
      setTimeout(() => this.subscribeToDoseScheduled(), 5000);
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

