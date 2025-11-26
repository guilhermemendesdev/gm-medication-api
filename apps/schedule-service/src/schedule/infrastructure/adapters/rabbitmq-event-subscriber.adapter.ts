import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventSubscriberPort } from '../../domain/ports/event-subscriber.port';
import { GenerateScheduleUseCase, PrescriptionData } from '../../application/use-cases/generate-schedule.use-case';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQEventSubscriberAdapter implements EventSubscriberPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQEventSubscriberAdapter.name);
  private connection: any = null;
  private channel: any = null;
  private readonly exchangeName = 'prescription_events';
  private readonly queueName = 'prescription.created.schedule';

  constructor(private readonly generateScheduleUseCase: GenerateScheduleUseCase) {}

  async onModuleInit() {
    await this.subscribeToPrescriptionCreated();
  }

  async subscribeToPrescriptionCreated(): Promise<void> {
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

      // Criar exchange e queue
      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      await this.channel.assertQueue(this.queueName, { durable: true });
      await this.channel.bindQueue(this.queueName, this.exchangeName, 'prescription.created');

      // Consumir mensagens
      await this.channel.consume(
        this.queueName,
        async (msg: amqp.ConsumeMessage | null) => {
          if (msg && this.channel) {
            try {
              const content = JSON.parse(msg.content.toString());
              this.logger.log(`Evento recebido: ${content.prescriptionId}`);

              // Transformar o evento em dados de prescrição
              const prescriptionData: PrescriptionData = {
                prescriptionId: content.prescriptionId,
                patientId: content.patientId,
                frequency: content.frequency,
                startDate: new Date(content.startDate),
                endDate: new Date(content.endDate),
                intervalHours: content.intervalHours,
                customSchedule: content.customSchedule,
              };

              // Gerar os agendamentos
              const schedules = await this.generateScheduleUseCase.execute(prescriptionData);
              this.logger.log(
                `${schedules.length} agendamentos criados para prescrição ${content.prescriptionId}`,
              );

              // Confirmar processamento
              this.channel.ack(msg);
            } catch (error) {
              this.logger.error('Erro ao processar evento:', error);
              // Rejeitar e não recolocar na fila (ou implementar DLQ)
              if (this.channel && msg) {
                this.channel.nack(msg, false, false);
              }
            }
          }
        },
        { noAck: false },
      );

      this.logger.log('Subscrito ao evento PrescriptionCreated');
    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ:', error);
      // Tentar reconectar após 5 segundos
      setTimeout(() => this.subscribeToPrescriptionCreated(), 5000);
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

