import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { PricesController } from './prices.controller';
import { MarketsController } from './markets.controller';

@Module({
  controllers: [PricesController, MarketsController],
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
