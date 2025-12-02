import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    NestCacheModule.register({
      ttl: 300, // 5 minutos (default)
      max: 100, // máximo de itens no cache
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}

// Nota: Para usar Redis, você pode instalar cache-manager-redis-store
// e configurar o store aqui. Por enquanto, usamos cache em memória.
