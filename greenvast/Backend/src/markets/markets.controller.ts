import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MarketsService } from './markets.service';

@ApiTags('Markets')
@Controller({ path: 'markets', version: '1' })
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  listMarkets() {
    return this.marketsService.listMarkets();
  }
}
