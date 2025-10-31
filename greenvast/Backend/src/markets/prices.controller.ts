import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MarketsService } from './markets.service';
import type { WeeklyPriceResponse } from './markets.service';

@ApiTags('Prices')
@Controller({ path: 'prices', version: '1' })
export class PricesController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  getWeeklyPrice(
    @Query('commodity') commodity: string,
    @Query('market') market?: string,
  ): Promise<WeeklyPriceResponse> {
    return this.marketsService.getWeeklyPrice(commodity, market);
  }
}
