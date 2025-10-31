import { Module } from '@nestjs/common';
import { NetworthService } from './networth.service';
import { NetworthController } from './networth.controller';
import { MarketsModule } from '../markets/markets.module';

@Module({
  imports: [MarketsModule],
  controllers: [NetworthController],
  providers: [NetworthService],
})
export class NetworthModule {}
