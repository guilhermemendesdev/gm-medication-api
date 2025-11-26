import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DoseTrackingRepositoryPort } from '../../domain/repositories/dose-tracking.repository.port';
import { MarkMissedDoseUseCase } from '../use-cases/mark-missed-dose.use-case';
import { INJECTION_TOKENS } from '../../domain/repositories/injection.tokens';
import { DoseTrackingStatus } from '../../domain/entities/dose-tracking.entity';

@Injectable()
export class CheckMissedDosesService {
  constructor(
    @Inject(INJECTION_TOKENS.DOSE_TRACKING_REPOSITORY)
    private readonly doseTrackingRepository: DoseTrackingRepositoryPort,
    private readonly markMissedDoseUseCase: MarkMissedDoseUseCase,
  ) {}

  // Executa a cada hora para verificar doses vencidas
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const now = new Date();
    // Buscar doses pendentes que deveriam ter sido tomadas há mais de 30 minutos
    const cutoffTime = new Date(now.getTime() - 30 * 60 * 1000);

    const pendingDoses = await this.doseTrackingRepository.findPendingByScheduledDateBefore(
      cutoffTime,
    );

    for (const dose of pendingDoses) {
      if (dose.status === DoseTrackingStatus.PENDING) {
        try {
          await this.markMissedDoseUseCase.execute(dose.id);
        } catch (error) {
          console.error(`Erro ao marcar dose ${dose.id} como perdida:`, error);
        }
      }
    }
  }
}

