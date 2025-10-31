import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KamisService } from './kamis.service';
import { MarketsModule } from '../markets/markets.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
    }),
    MarketsModule,
  ],
  providers: [KamisService],
  exports: [KamisService],
})
export class IntegrationsModule {}
