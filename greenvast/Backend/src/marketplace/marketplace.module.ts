import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { ChatGateway } from './chat.gateway';
import { RfqController } from './rfq.controller';
import { RfqService } from './rfq.service';

@Module({
  providers: [ListingsService, OffersService, RfqService, ChatGateway],
  controllers: [ListingsController, OffersController, RfqController],
  exports: [ListingsService, OffersService, RfqService],
})
export class MarketplaceModule {}
